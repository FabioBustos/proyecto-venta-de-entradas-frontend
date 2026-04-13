import { NextRequest, NextResponse } from 'next/server';
import { withLogging } from '@/lib/api-logger';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function loginHandler(request: NextRequest) {
  const body = await request.json();
  
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  
  return NextResponse.json(data, { status: response.status });
}

async function googleHandler(request: NextRequest) {
  const response = await fetch(`${API_URL}/auth/google`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  return NextResponse.json(data, { status: response.status });
}

async function forgotPasswordHandler(request: NextRequest) {
  const body = await request.json();
  
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  
  return NextResponse.json(data, { status: response.status });
}

async function resetPasswordHandler(request: NextRequest) {
  const body = await request.json();
  
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  
  return NextResponse.json(data, { status: response.status });
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  if (action === 'forgot-password') {
    return withLogging(forgotPasswordHandler, request);
  }

  if (action === 'reset-password') {
    return withLogging(resetPasswordHandler, request);
  }

  return withLogging(loginHandler, request);
}

export async function GET(request: NextRequest) {
  return withLogging(googleHandler, request);
}