import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await db.rsvp.getAll();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, status, guests } = body;
    
    if (!name || !status) {
      return NextResponse.json({ error: 'Incomplete data' }, { status: 400 });
    }

    const newRsvp = await db.rsvp.add({ name, status, guests: guests || 0 });
    return NextResponse.json(newRsvp);
  } catch (error: any) {
    console.error("RSVP POST Error:", JSON.stringify(error, null, 2));
    const errorMessage = error?.message || String(error);
    if (errorMessage.includes('timed out')) {
      return NextResponse.json({ error: 'Request timed out. Please try again.' }, { status: 504 });
    }
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await db.rsvp.delete(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
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

    await db.rsvp.update(Number(id), data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
