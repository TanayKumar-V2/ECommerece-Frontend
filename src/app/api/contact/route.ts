import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';
import { revalidatePath } from 'next/cache';

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
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
