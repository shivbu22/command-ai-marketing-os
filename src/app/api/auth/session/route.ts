import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  if (!idToken) {
    return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
  }

  try {
    // Check for mock token fallback
    if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true' && idToken === 'mock-token') {
       const response = NextResponse.json({ status: 'success' });
       response.cookies.set('__session', 'mock-session-cookie', {
         maxAge: 60 * 60 * 24 * 5 * 1000,
         httpOnly: true,
         secure: false,
         path: '/',
       });
       return response;
    }

    // Set session cookie with a 5-day expiration
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ status: 'success' });
    
    response.cookies.set('__session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Session creation error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ status: 'success' });
  response.cookies.delete('__session');
  return response;
}
