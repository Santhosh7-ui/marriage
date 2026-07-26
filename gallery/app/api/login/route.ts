import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.GUEST_PASSWORD;

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: 'guest_auth',
        value: 'true',
        httpOnly: true,
        sameSite: 'lax',           // ← prevents CSRF
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return response;
    } else {
      return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 });
    }
  } catch (e: unknown) {
    console.error('Login error:', e);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
