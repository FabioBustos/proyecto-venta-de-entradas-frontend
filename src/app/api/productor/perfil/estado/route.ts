import { NextRequest, NextResponse } from 'next/server';
import { withLogging } from '@/lib/api-logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handler(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  const response = await fetch(`${API_URL}/productor/perfil/estado`, {
    headers: {
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function GET(request: NextRequest) {
  return withLogging(handler, request);
}