import { NextRequest, NextResponse } from 'next/server';
import { withLogging } from '@/lib/api-logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handler(request: NextRequest, { params }: { params: { eventoId: string; sesionId: string } }) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    );
  }

  const response = await fetch(`${API_URL}/productor/eventos/${params.eventoId}/sesiones/${params.sesionId}/notificar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return NextResponse.json(
      { error: error.message || 'Failed to notify waiting list' },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest, { params }: { params: { eventoId: string; sesionId: string } }) {
  return withLogging((req) => handler(req, { params }), request);
}
