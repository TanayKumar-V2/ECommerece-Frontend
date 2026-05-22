import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Verification token is required' }, { status: 400 });
    }

    await dbConnect();

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOneAndUpdate(
      {
        verificationToken: hashedToken,
        verificationTokenExpiry: { $gt: new Date() },
      },
      {
        $set: { emailVerified: true },
        $unset: { verificationToken: '', verificationTokenExpiry: '' },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'This verification link is invalid or has expired.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Email verified successfully. You can now sign in.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in verify-email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
