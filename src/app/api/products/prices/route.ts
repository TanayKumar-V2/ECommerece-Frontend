import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get('ids');

    if (!idsParam) {
      return NextResponse.json({ prices: {} });
    }

    const ids = idsParam.split(',').filter(Boolean);

    await dbConnect();

    const products = await Product.find(
      { _id: { $in: ids } },
      { _id: 1, price: 1 }
    ).lean();

    const prices: Record<string, number> = {};
    for (const p of products as any[]) {
      prices[p._id.toString()] = p.price;
    }

    return NextResponse.json({ prices });
  } catch (error) {
    console.error('Error fetching product prices:', error);
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
  }
}
