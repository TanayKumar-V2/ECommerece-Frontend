import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { pushOrderToQikink } from '@/lib/qikink';
import ReceiptEmail from '@/emails/ReceiptEmail';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function POST(req: Request) {
  try {
    // Authentication check - verify user is logged in
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, mongo_order_id } = body;

    // Verify signature
    const bodyText = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(bodyText.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json({ error: 'Invalid Signature' }, { status: 400 });
    }

    await dbConnect();

    // Update MongoDB Order status (Atomic check to prevent race conditions)
    // CRITICAL: Validate that razorpay_order_id matches the order to prevent payment hijacking
    const order = await Order.findOneAndUpdate(
      {
        _id: mongo_order_id,
        razorpayOrderId: razorpay_order_id,
        status: 'pending'
      },
      {
        status: 'paid',
        paymentId: razorpay_payment_id
      },
      { new: true }
    ).populate({ path: 'products.product', model: 'Product' });

    if (!order) {
      // Check if it was already marked as paid (Idempotency)
      const existingOrder = await Order.findById(mongo_order_id);
      if (existingOrder && existingOrder.status === 'paid') {
        return NextResponse.json({ message: 'Payment already verified' }, { status: 200 });
      }
      // Log potential fraud attempt
      console.error(`FRAUD ALERT: Payment verification mismatch for order ${mongo_order_id}. Provided razorpay_order_id: ${razorpay_order_id}, stored: ${existingOrder?.razorpayOrderId}`);
      return NextResponse.json({ error: 'Order verification failed' }, { status: 400 });
    }

    // Verify order ownership
    if (order.user.toString() !== userId) {
      console.error(`FRAUD ALERT: User ${userId} attempted to verify order owned by ${order.user}`);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Deduct inventory after successful payment
    try {
      for (const item of order.products) {
        await Product.findByIdAndUpdate(
          item.product._id,
          { $inc: { stock: -item.quantity } }
        );
      }
    } catch (inventoryError) {
      console.error('Failed to deduct inventory (non-fatal):', inventoryError);
      // Don't fail the payment - log for manual reconciliation
    }

    // Phase 5: Automated Qikink Fulfillment
    // Call Qikink in a background process attached to DB save success
    try {
       await pushOrderToQikink(mongo_order_id);
    } catch (qikinkError) {
       console.error("Failed to trigger Qikink fulfillment after successful payment:", qikinkError);
       // We still return success to the user as their payment was successful.
    }

    // Phase 6: Send transactional receipt email via Resend (non-fatal)
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

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Viraasat <onboarding@resend.dev>',
          to: user.email,
          subject: `Your Viraasat order #${order._id.toString().slice(-8).toUpperCase()} is confirmed!`,
          react: ReceiptEmail({
            orderId: order._id.toString(),
            customerName: user.name ?? 'Valued Customer',
            paymentId: razorpay_payment_id,
            items: emailItems,
            totalAmount: order.totalAmount,
            shippingAddress: order.shippingAddress,
          }),
        });

        console.log(`Receipt email sent to ${user.email} for order ${order._id}`);
      }
    } catch (emailError) {
      console.error("Failed to send receipt email (non-fatal):", emailError);
      // Email failure does NOT affect the payment success response.
    }

    return NextResponse.json({ message: 'Payment verified successfully and fulfillment triggered' }, { status: 200 });

  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
