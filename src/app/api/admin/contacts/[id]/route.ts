import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    await dbConnect();
    const { status } = await req.json();
    if (!['new', 'read', 'resolved'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    await ContactMessage.findByIdAndUpdate(resolvedParams.id, { status });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact status update error:', err);
    return NextResponse.json({ error: 'Failed to update status.' }, { status: 500 });
  }
}
