import { ArrowUpFromLine, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import Notifications from './Notifications';
import { UserDropdownMenu } from './UserDropdownMenu';

export default function Header() {
	return (
		<header className='sticky top-0 z-10 flex h-12 justify-center border-b bg-background shadow-sm'>
			<a
				href='#main-content'
				className='sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:ring-2 focus:ring-ring'
			>
				Skip to main content
			</a>
			<nav className='flex w-full max-w-[80rem] items-center justify-between'>
				<div className='flex h-full items-center gap-4 px-4 text-lg font-semibold md:w-40 md:gap-6 xl:px-2'>
					<Link href='/' className='transition-colors hover:text-primary'>
						Home
					</Link>
					<Link
						href='/library'
						className='transition-colors hover:text-primary'
					>
						Library
					</Link>
				</div>
				<div className='flex h-full items-center justify-end gap-1 px-4 md:w-40 xl:px-2'>
					<Link
						href='/search'
						aria-label='Search'
						className='flex size-8 min-w-8 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground'
					>
						<SearchIcon className='size-5' aria-hidden='true' />
					</Link>
					<Notifications />
					<Link
						href='/upload'
						aria-label='Upload'
						className='mr-1 flex size-8 min-w-8 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground'
					>
						<ArrowUpFromLine className='size-5' aria-hidden='true' />
					</Link>
					<UserDropdownMenu />
				</div>
			</nav>
		</header>
	);
}
