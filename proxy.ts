import { type NextRequest, NextResponse } from 'next/server';
import { REFRESH_TOKEN } from './config';

export function proxy(request: NextRequest) {
	const { url, cookies, nextUrl } = request;
	const { pathname } = nextUrl;

	const refreshToken = cookies.get(REFRESH_TOKEN)?.value;
	const isAuthPage =
		pathname === '/login' ||
		pathname === '/signup' ||
		pathname.startsWith('/verify');

	if (refreshToken && isAuthPage) {
		return NextResponse.redirect(new URL('/', url));
	}

	if (!refreshToken && !isAuthPage) {
		return NextResponse.redirect(new URL('/login', url));
	}

	if (pathname === '/settings') {
		return NextResponse.redirect(new URL('/settings/profile', url));
	}

	if (pathname === '/library') {
		return NextResponse.redirect(new URL('/library/tracks', url));
	}

	if (pathname === '/upload') {
		return NextResponse.redirect(new URL('/upload/track', url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
