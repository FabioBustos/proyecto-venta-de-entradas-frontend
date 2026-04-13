import { NextRequest, NextResponse } from 'next/server';
import { withLogging } from '@/lib/api-logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getHandler(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader || '',
    },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

async function patchHandler(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const body = await request.json();

  const userId = body._id || body.id;
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const response = await fetch(`${API_URL}/usuarios/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader || '',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function GET(request: NextRequest) {
  return withLogging(getHandler, request);
}

export async function PATCH(request: NextRequest) {
  return withLogging(patchHandler, request);
}
