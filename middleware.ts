import { NextRequest, NextResponse } from 'next/server';
import { REFRESH_TOKEN } from './api/interceptors';

export function middleware(request: NextRequest) {
	const { url, cookies } = request;
	const refreshToken = cookies.get(REFRESH_TOKEN)?.value;
	const isAuthPage = url.includes('/login') || url.includes('/signup'); // TODO

	if (refreshToken && isAuthPage) {
		return NextResponse.redirect(new URL('/', url));
	}

	if (!refreshToken && !isAuthPage) {
		return NextResponse.redirect(new URL('/login', url));
	}

	if (url === 'http://localhost:3000/settings') {
		// TODO
		return NextResponse.redirect(new URL('/settings/profile', url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
