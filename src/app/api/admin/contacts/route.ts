import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';

export async function GET() {
  try {
    await dbConnect();
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();
    const serialized = messages.map((m: any) => ({
      id: m._id.toString(),
      name: m.name,
      email: m.email,
      phone: m.phone,
      query: m.query,
      status: m.status,
      createdAt: m.createdAt,
    }));
    return NextResponse.json({ messages: serialized });
  } catch (err) {
    console.error('Admin contacts fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch messages.' }, { status: 500 });
  }
}
