import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { transporter } from '@/lib/nodemailer';
import dbConnect from '@/lib/db';
import Cart from '@/models/Cart';
import User from '@/models/User';
import AbandonedCartEmail from '@/emails/AbandonedCartEmail';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const cutoff = new Date(Date.now() - 60 * 60 * 1000);

    const abandonedCarts = await Cart.find({
      recovered: false,
      recoveryEmailSentAt: null,
      createdAt: { $lt: cutoff },
    });

    let sent = 0;
    let skipped = 0;

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXTAUTH_URL ||
      'https://viraasatclothing.store';

    for (const cart of abandonedCarts) {
      try {
        const user = await User.findById(cart.user).lean() as { name?: string } | null;

        const emailHtml = await render(
          AbandonedCartEmail({
            name: user?.name || 'Valued Customer',
            items: cart.items.map((i: any) => ({
              name: i.name,
              quantity: i.quantity,
              price: i.price,
            })),
            totalAmount: cart.totalAmount,
            checkoutLink: `${baseUrl}/checkout`,
          })
        );

        await transporter.sendMail({
          from: `"Viraasat" <${process.env.GMAIL_USER}>`,
          to: cart.email,
          subject: 'Complete your Viraasat order — items still in your cart!',
          html: emailHtml,
        });

        cart.recoveryEmailSentAt = new Date();
        await cart.save();
        sent++;
      } catch (err) {
        console.error(`Failed to send recovery email for cart ${cart._id}:`, err);
        skipped++;
      }
    }

    return NextResponse.json({ sent, skipped, total: abandonedCarts.length });
  } catch (error) {
    console.error('Abandoned cart cron error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
