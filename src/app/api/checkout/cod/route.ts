import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { transporter } from '@/lib/nodemailer';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { pushOrderToQikink } from '@/lib/qikink';
import ReceiptEmail from '@/emails/ReceiptEmail';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { items, shippingAddress } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    await dbConnect();

    let calculatedSubtotal = 0;
    const orderProducts = [];

    // Recalculate price server-side (Zero Client Trust)
    for (const item of items) {
      const product = await Product.findById(item.id);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.id}` }, { status: 404 });
      }

      // Validate stock availability
      if (typeof product.stock === 'number' && product.stock < item.quantity) {
        return NextResponse.json({
          error: `Insufficient stock for "${product.title}". Available: ${product.stock}, Requested: ${item.quantity}`
        }, { status: 400 });
      }

      calculatedSubtotal += product.price * item.quantity;
      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        size: item.size,
        color: item.color || (product.colors && product.colors.length > 0 ? product.colors[0] : 'N/A')
      });
    }

    const shipping = 0;
    const calculatedTotal = calculatedSubtotal + shipping;

    // Create MongoDB Order
    const newOrder = await Order.create({
      user: userId,
      products: orderProducts,
      totalAmount: calculatedTotal,
      paymentMethod: 'cod',
      status: 'processing', // Since it's COD, it bypasses 'pending' payment
      shippingAddress: {
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        addressLine1: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode
      }
    });

    // Populate products for email and Qikink
    const populatedOrder = await Order.findById(newOrder._id).populate({ path: 'products.product', model: 'Product' });

    // Deduct inventory
    try {
      for (const item of orderProducts) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity } }
        );
      }
    } catch (inventoryError) {
      console.error('Failed to deduct inventory (non-fatal):', inventoryError);
    }

    // Push to Qikink
    try {
       await pushOrderToQikink(newOrder._id);
    } catch (qikinkError) {
       console.error("Failed to trigger Qikink fulfillment for COD order:", qikinkError);
    }

    // Send Receipt Email
    try {
      const user = await User.findById(userId).lean() as { email?: string; name?: string } | null;

      if (user?.email && populatedOrder) {
        const emailItems = populatedOrder.products.map((item: any) => ({
          title: item.product?.title ?? 'Product',
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.product?.price,
        }));

        const emailHtml = await render(ReceiptEmail({
          orderId: populatedOrder._id.toString(),
          customerName: user.name ?? 'Valued Customer',
          paymentId: 'Cash on Delivery',
          items: emailItems,
          totalAmount: populatedOrder.totalAmount,
          shippingAddress: populatedOrder.shippingAddress,
        }));

        await transporter.sendMail({
          from: `"Viraasat" <${process.env.GMAIL_USER}>`,
          to: user.email,
          subject: `Your Viraasat COD order #570176_${populatedOrder._id.toString().slice(-10)} is confirmed!`,
          html: emailHtml,
        });

        console.log(`Receipt email sent to ${user.email} for COD order ${populatedOrder._id}`);
      }
    } catch (emailError) {
      console.error("Failed to send receipt email (non-fatal):", emailError);
    }

    return NextResponse.json({
      message: 'Order created successfully',
      order_id: newOrder._id
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error creating COD order:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
