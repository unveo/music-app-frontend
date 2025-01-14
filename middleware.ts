import { NextRequest, NextResponse } from 'next/server';
import { baseUrl, REFRESH_TOKEN } from './config';

export function middleware(request: NextRequest) {
	const { url, cookies } = request;

	const refreshToken = cookies.get(REFRESH_TOKEN)?.value;

	const isAuthPage =
		url === `${baseUrl.frontend}/login` ||
		url === `${baseUrl.frontend}/signup` ||
		url.startsWith(`${baseUrl.frontend}/verify`);

	if (refreshToken && isAuthPage) {
		return NextResponse.redirect(new URL('/', url));
	}

	if (!refreshToken && !isAuthPage) {
		return NextResponse.redirect(new URL('/login', url));
	}

	if (url === `${baseUrl.frontend}/settings`) {
		return NextResponse.redirect(new URL('/settings/profile', url));
	}

	if (url === `${baseUrl.frontend}/library`) {
		return NextResponse.redirect(new URL('/library/tracks', url));
	}

	if (url === `${baseUrl.frontend}/upload`) {
		return NextResponse.redirect(new URL('/upload/track', url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
