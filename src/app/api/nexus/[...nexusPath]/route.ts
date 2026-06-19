
import { NextRequest, NextResponse } from 'next/server';
import { NexusBridge } from '@/nexusbridge/core/engine';

const bridge = new NexusBridge();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ nexusPath: string[] }> }
) {
  const { nexusPath } = await params;
  const path = nexusPath.join('/');
  
  const result = await bridge.handleRequest({
    path,
    method: 'GET',
    headers: Object.fromEntries(request.headers)
  });

  return NextResponse.json(result.data, { status: result.status });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ nexusPath: string[] }> }
) {
  const { nexusPath } = await params;
  const path = nexusPath.join('/');
  const body = await request.json().catch(() => ({}));
  
  const result = await bridge.handleRequest({
    path,
    method: 'POST',
    body,
    headers: Object.fromEntries(request.headers)
  });

  return NextResponse.json(result.data, { status: result.status });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ nexusPath: string[] }> }
) {
  const { nexusPath } = await params;
  const path = nexusPath.join('/');
  const body = await request.json().catch(() => ({}));
  
  const result = await bridge.handleRequest({
    path,
    method: 'PUT',
    body,
    headers: Object.fromEntries(request.headers)
  });

  return NextResponse.json(result.data, { status: result.status });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ nexusPath: string[] }> }
) {
  const { nexusPath } = await params;
  const path = nexusPath.join('/');
  
  const result = await bridge.handleRequest({
    path,
    method: 'DELETE',
    headers: Object.fromEntries(request.headers)
  });

  return NextResponse.json(result.data, { status: result.status });
}

