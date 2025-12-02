import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json(
    { error: 'Legacy NextAuth route is disabled. Use /api/auth/login instead.' },
    { status: 404 },
  );
}

export function POST() {
  return NextResponse.json(
    { error: 'Legacy NextAuth route is disabled. Use /api/auth/login instead.' },
    { status: 404 },
  );
}
