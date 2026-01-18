import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const invitations = db.invitations.getAll();
  return NextResponse.json(invitations);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guestName, slug } = body;
    
    if (!guestName || !slug) {
      return NextResponse.json({ error: 'Guest name and slug required' }, { status: 400 });
    }

    const newInvitation = db.invitations.add({ guestName, slug });
    return NextResponse.json(newInvitation);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    db.invitations.delete(Number(id));
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

    db.invitations.update(Number(id), data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
