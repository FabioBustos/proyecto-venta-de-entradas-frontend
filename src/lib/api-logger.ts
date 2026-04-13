import { NextRequest, NextResponse } from 'next/server';

type LogLevel = 'info' | 'warn' | 'error';

interface LogData {
  method: string;
  path: string;
  status?: number;
  duration?: number;
  error?: string;
  body?: unknown;
  query?: Record<string, unknown>;
}

class ApiLogger {
  private formatLog(level: LogLevel, data: LogData, requestId: string): string {
    const timestamp = new Date().toISOString();
    const emoji = {
      info: '📘',
      warn: '⚠️',
      error: '❌',
    }[level];

    let log = `
${emoji} [${timestamp}] [${requestId}] ${level.toUpperCase()} ${data.method} ${data.path}`;

    if (data.status) log += ` - ${data.status}`;
    if (data.duration) log += ` (${data.duration}ms)`;
    if (data.query && Object.keys(data.query).length > 0) log += `\n  Query: ${JSON.stringify(data.query)}`;
    if (data.body) log += `\n  Body: ${JSON.stringify(data.body)}`;
    if (data.error) log += `\n  Error: ${data.error}`;

    return log;
  }

  log(level: LogLevel, data: LogData) {
    const requestId = crypto.randomUUID().slice(0, 8);
    const log = this.formatLog(level, data, requestId);
    console.log(log);
    return requestId;
  }

  info(data: LogData) {
    return this.log('info', data);
  }

  warn(data: LogData) {
    return this.log('warn', data);
  }

  error(data: LogData) {
    return this.log('error', data);
  }
}

export const apiLogger = new ApiLogger();

export async function withLogging(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  request: NextRequest,
  context?: any
): Promise<NextResponse> {
  const start = performance.now();
  const method = request.method;
  const path = request.url.split('?')[0];
  const query = Object.fromEntries(new URL(request.url).searchParams);

  apiLogger.info({ method, path, query });

  try {
    const response = await handler(request, context);
    const duration = performance.now() - start;
    
    apiLogger.info({ 
      method, 
      path, 
      status: response.status, 
      duration,
      query 
    });

    return response;
  } catch (error) {
    const duration = performance.now() - start;
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    apiLogger.error({ 
      method, 
      path, 
      status: 500, 
      duration, 
      error: message,
      query 
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
