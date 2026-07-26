import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST() {
  const response = NextResponse.json({ success: true });
  // Clear the cookie
  response.cookies.delete('guest_auth');
  return response;
}
