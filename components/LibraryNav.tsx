'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const links = [
	{ href: '/library/tracks', label: 'Liked Tracks' },
	{ href: '/library/playlists', label: 'Saved Playlists' },
	{ href: '/library/albums', label: 'Liked Albums' },
	{ href: '/library/history', label: 'History' },
	{ href: '/library/following', label: 'Following' },
	{ href: '/library/my-tracks', label: 'My Tracks' },
	{ href: '/library/my-albums', label: 'My Albums' }
] as const;

export default function LibraryNav() {
	const pathname = usePathname();

	return (
		<ScrollArea className='w-full whitespace-nowrap'>
			<nav className='library-nav'>
				{links.map(({ href, label }) => (
					<Link
						key={href}
						href={href}
						aria-current={pathname === href ? 'page' : undefined}
						className={cn(pathname === href && 'text-primary')}
					>
						{label}
					</Link>
				))}
			</nav>
			<ScrollBar orientation='horizontal' />
		</ScrollArea>
	);
}
