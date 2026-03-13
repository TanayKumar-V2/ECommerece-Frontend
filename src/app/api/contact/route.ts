import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import ContactAdminEmail from '@/emails/ContactAdminEmail';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, phone, query } = body;

    if (!name || !email || !phone || !query) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    await ContactMessage.create({ name, email, phone, query });
    revalidatePath('/admin/contacts');

    // Send notification email to admin
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Viraasat <onboarding@resend.dev>',
        to: 'viraasat.store18@gmail.com', // Admin notification destination
        subject: `New Inquiry from ${name}`,
        react: ContactAdminEmail({ name, email, phone, query }),
      });
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
