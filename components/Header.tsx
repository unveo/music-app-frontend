import Link from 'next/link';
import { ArrowUpFromLine } from 'lucide-react';
import { UserDropdownMenu } from './UserDropdownMenu';
import Notifications from './Notifications';

export default function Header() {
	return (
		<header className='sticky top-0 z-10 flex h-12 justify-center border-b bg-background shadow-sm'>
			<nav className='flex w-full max-w-[80rem] items-center justify-between'>
				<div className='flex h-full items-center gap-6 px-2 text-lg font-semibold md:w-40'>
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
				<div className='flex h-full items-center justify-end px-2 md:w-40'>
					<Notifications></Notifications>
					<Link
						href='/upload'
						className='ml-1 mr-2 flex size-8 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground'
					>
						<ArrowUpFromLine className='size-5' />
					</Link>
					<UserDropdownMenu></UserDropdownMenu>
				</div>
			</nav>
		</header>
	);
}
