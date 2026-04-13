import { NextRequest, NextResponse } from 'next/server';
import { withLogging } from '@/lib/api-logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getHandler(request: NextRequest, { params }: { params: { eventoId: string } }) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    );
  }

  const response = await fetch(`${API_URL}/productor/eventos/${params.eventoId}/sesiones`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
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

async function postHandler(request: NextRequest, { params }: { params: { eventoId: string } }) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    );
  }

  const body = await request.json();

  const response = await fetch(`${API_URL}/productor/eventos/${params.eventoId}/sesiones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return NextResponse.json(
      { error: error.message || 'Failed to create sesion' },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}

export async function GET(request: NextRequest, { params }: { params: { eventoId: string } }) {
  return withLogging((req) => getHandler(req, { params }), request);
}

export async function POST(request: NextRequest, { params }: { params: { eventoId: string } }) {
  return withLogging((req) => postHandler(req, { params }), request);
}
