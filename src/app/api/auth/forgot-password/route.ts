import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { render } from '@react-email/render';
import { transporter } from '@/lib/nodemailer';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import ResetPasswordEmail from '@/emails/ResetPasswordEmail';
import { rateLimit } from '@/lib/rateLimit';

const limiter = rateLimit({ windowMs: 60_000, max: 3 });

export async function POST(req: Request) {
  try {
    const { passed, message, status } = limiter(req);
    if (!passed) {
      return NextResponse.json({ error: message }, { status });
    }

    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json(
        { message: 'If an account with that email exists, a reset link has been sent.' },
        { status: 200 }
      );
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXTAUTH_URL ||
      'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${rawToken}`;

    try {
      const emailHtml = await render(
        ResetPasswordEmail({ name: user.name, resetLink })
      );

      await transporter.sendMail({
        from: `"Viraasat" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: 'Reset your Viraasat password',
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Failed to send reset email (non-fatal):', emailError);
    }

    return NextResponse.json(
      { message: 'If an account with that email exists, a reset link has been sent.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in forgot-password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
