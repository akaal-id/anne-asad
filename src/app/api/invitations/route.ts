import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const invitations = await db.invitations.getAll();
  return NextResponse.json(invitations);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guestName, slug } = body;
    
    if (!guestName || !slug) {
      return NextResponse.json({ error: 'Guest name and slug required' }, { status: 400 });
    }

    const newInvitation = await db.invitations.add({ guestName, slug });
    return NextResponse.json(newInvitation);
  } catch (error: any) {
    console.error('Error in POST /api/invitations:', error);
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

    await db.invitations.delete(Number(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/invitations:', error);
    const errorMessage = error?.message || String(error);
    if (errorMessage.includes('timed out')) {
      return NextResponse.json({ error: 'Request timed out. Please try again.' }, { status: 504 });
    }
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await db.invitations.update(Number(id), data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in PUT /api/invitations:', error);
    const errorMessage = error?.message || String(error);
    if (errorMessage.includes('timed out')) {
      return NextResponse.json({ error: 'Request timed out. Please try again.' }, { status: 504 });
    }
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
