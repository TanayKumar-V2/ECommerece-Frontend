import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';
import { revalidatePath } from 'next/cache';
import { render } from '@react-email/render';
import { transporter } from '@/lib/nodemailer';
import ContactAdminEmail from '@/emails/ContactAdminEmail';

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
      const emailHtml = await render(ContactAdminEmail({ name, email, phone, query }));
      await transporter.sendMail({
        from: `"Viraasat Contact" <${process.env.GMAIL_USER}>`,
        to: 'viraasat.store18@gmail.com', // Admin notification destination
        subject: `New Inquiry from ${name}`,
        html: emailHtml,
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
