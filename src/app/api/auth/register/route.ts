import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { render } from '@react-email/render';
import { transporter } from '@/lib/nodemailer';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { rateLimit } from '@/lib/rateLimit';
import VerifyEmail from '@/emails/VerifyEmail';

const limiter = rateLimit({ windowMs: 60_000, max: 5 });

export async function POST(req: NextRequest) {
  try {
    const { passed, message, status } = limiter(req);
    if (!passed) {
      return NextResponse.json({ error: message }, { status });
    }

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json(
        { message: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'user',
      emailVerified: false,
      verificationToken: hashedToken,
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXTAUTH_URL ||
        'http://localhost:3000';
      const verifyLink = `${baseUrl}/verify-email?token=${rawToken}`;

      const emailHtml = await render(
        VerifyEmail({ name: newUser.name, verifyLink })
      );

      await transporter.sendMail({
        from: `"Viraasat" <${process.env.GMAIL_USER}>`,
        to: newUser.email,
        subject: 'Verify your Viraasat email address',
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    return NextResponse.json(
      {
        message:
          'Account created successfully! Please check your email to verify your account before signing in.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json(
      { message: 'An internal server error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
