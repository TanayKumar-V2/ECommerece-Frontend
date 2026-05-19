import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
