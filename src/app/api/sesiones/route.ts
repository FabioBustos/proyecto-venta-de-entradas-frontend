import { NextRequest, NextResponse } from 'next/server';
import { withLogging } from '@/lib/api-logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventoId = searchParams.get('eventoId');

  if (!eventoId) {
    return NextResponse.json({ error: 'eventoId is required' }, { status: 400 });
  }

  const response = await fetch(`${API_URL}/sesiones/evento/${eventoId}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sesiones' },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}

export async function GET(request: NextRequest) {
  return withLogging(getHandler, request);
}
