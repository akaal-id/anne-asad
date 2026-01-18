import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const wishes = await db.wishes.getAll();
  return NextResponse.json(wishes);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, message } = body;
    
    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message required' }, { status: 400 });
    }

    const newWish = await db.wishes.add({ name, message });
    return NextResponse.json(newWish);
  } catch (error) {
    console.error('Error in POST /api/wishes:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await db.wishes.delete(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/wishes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await db.wishes.update(Number(id), data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/wishes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
