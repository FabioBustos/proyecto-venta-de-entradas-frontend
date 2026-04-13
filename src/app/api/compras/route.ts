import { NextRequest, NextResponse } from 'next/server';
import { withLogging } from '@/lib/api-logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getHandler(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  const response = await fetch(`${API_URL}/compras`, {
    headers: {
      'Content-Type': 'application/json',
      ...(authHeader && { Authorization: authHeader }),
    },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

async function postHandler(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const body = await request.json();

  const response = await fetch(`${API_URL}/compras`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authHeader && { Authorization: authHeader }),
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function GET(request: NextRequest) {
  return withLogging(getHandler, request);
}

export async function POST(request: NextRequest) {
  return withLogging(postHandler, request);
}
