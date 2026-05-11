import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const ua = req.headers.get('user-agent') || '';
  const url = req.nextUrl.clone();

  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop|BlackBerry/i.test(ua);

  // Zakáž presmerovanie pri priamom vstupe na /m alebo /m/dashboard
  if (url.pathname.startsWith('/m')) {
    return NextResponse.next();
  }

  // Mobile landing redirect
  if (isMobile && url.pathname === '/') {
    url.pathname = '/m';
    return NextResponse.redirect(url);
  }

  // Mobile dashboard redirect
  if (isMobile && url.pathname === '/dashboard') {
    url.pathname = '/m/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard'],
};