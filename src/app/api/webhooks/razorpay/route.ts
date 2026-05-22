import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { render } from '@react-email/render';
import { transporter } from '@/lib/nodemailer';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { pushOrderToQikink } from '@/lib/qikink';
import ReceiptEmail from '@/emails/ReceiptEmail';

export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Missing RAZORPAY_WEBHOOK_SECRET');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );

    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event !== 'payment.captured') {
      return NextResponse.json({ status: 'ignored' });
    }

    const payment = event.payload.payment.entity;
    const razorpayOrderId = payment.order_id;
    const paymentId = payment.id;

    await dbConnect();

    const order = await Order.findOneAndUpdate(
      {
        razorpayOrderId,
        status: 'pending',
      },
      {
        status: 'paid',
        paymentId,
      },
      { new: true }
    ).populate({ path: 'products.product', model: 'Product' });

    if (!order) {
      const existingOrder = await Order.findOne({ razorpayOrderId });
      if (existingOrder && existingOrder.status === 'paid') {
        return NextResponse.json({ status: 'already_verified' });
      }
      console.error(`Webhook: Order not found for razorpayOrderId ${razorpayOrderId}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    try {
      for (const item of order.products) {
        await Product.findByIdAndUpdate(
          item.product._id,
          { $inc: { stock: -item.quantity } }
        );
      }
    } catch (inventoryError) {
      console.error('Webhook: Failed to deduct inventory (non-fatal):', inventoryError);
    }

    try {
      await pushOrderToQikink(order._id);
    } catch (qikinkError) {
      console.error('Webhook: Failed to push to Qikink (non-fatal):', qikinkError);
    }

    try {
      const user = await User.findById(order.user).lean() as { email?: string; name?: string } | null;

      if (user?.email) {
        const emailItems = order.products.map((item: any) => ({
          title: item.product?.title ?? 'Product',
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.product?.price,
        }));

        const emailHtml = await render(ReceiptEmail({
          orderId: order._id.toString(),
          customerName: user.name ?? 'Valued Customer',
          paymentId,
          items: emailItems,
          totalAmount: order.totalAmount,
          shippingAddress: order.shippingAddress,
        }));

        await transporter.sendMail({
          from: `"Viraasat" <${process.env.GMAIL_USER}>`,
          to: user.email,
          subject: `Your Viraasat order #570176_${order._id.toString().slice(-10)} is confirmed!`,
          html: emailHtml,
        });
      }
    } catch (emailError) {
      console.error('Webhook: Failed to send receipt email (non-fatal):', emailError);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
