import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });

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

      calculatedSubtotal += product.price * item.quantity;
      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        size: item.size,
        color: product.colors && product.colors.length > 0 ? product.colors[0] : 'N/A' // Use first color or N/A
      });
    }

    const shipping = 0;
    const calculatedTotal = calculatedSubtotal + shipping;

    // Create Razorpay Order
    const options = {
      amount: calculatedTotal * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create MongoDB Order
    const newOrder = await Order.create({
      user: userId,
      products: orderProducts,
      totalAmount: calculatedTotal,
      status: 'pending',
      shippingAddress: {
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        phone: shippingAddress.phone,
        addressLine1: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode
      }
    });

    return NextResponse.json({
      order_id: razorpayOrder.id,
      mongo_order_id: newOrder._id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: error.message || 'Error occurred while creating order' }, { status: 500 });
  }
}
