import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/db';
import { requireEditor, AuthError } from '../../../../../lib/auth-middleware';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireEditor(request);

    const { id } = await params;
    const body = await request.json();
    const { read, replied } = body;

    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: {
        ...(typeof read === 'boolean' && { read }),
        ...(typeof replied === 'boolean' && { replied })
      }
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error('Error updating contact message:', error);
    return NextResponse.json(
      { error: 'Failed to update contact message' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireEditor(request);

    const { id } = await params;

    await prisma.contactMessage.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error('Error deleting contact message:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact message' },
      { status: 500 }
    );
  }
}