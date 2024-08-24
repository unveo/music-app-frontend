import Link from 'next/link';
import { ArrowUpFromLine, Bell, Search } from 'lucide-react';
import { Button } from './ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import { UserDropdownMenu } from './UserDropdownMenu';

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
				<div className='hidden h-full w-80 items-center md:flex'>
					<div className='group flex h-8 w-full items-center rounded-md border border-foreground transition-colors hover:border-primary'>
						<Search className='mx-1.5 size-[1.20rem]' />
						<Input type='search' placeholder='Search' />
					</div>
				</div>
				<div className='flex h-full items-center justify-end gap-2 px-2 md:w-40'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								className='size-8 p-0 md:hidden'
							>
								<Search className='size-[1.20rem]' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-64 md:hidden'>
							<DropdownMenuItem onSelect={(event) => event.preventDefault()}>
								<div className='group flex h-8 w-full items-center rounded-md border border-foreground pl-1.5 transition-colors hover:border-primary'>
									<Input type='search' placeholder='Search' />
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Link
						href='/upload'
						className='flex size-8 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground'
					>
						<ArrowUpFromLine className='size-[1.20rem]' />
					</Link>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' size='icon' className='size-8 p-0'>
								<Bell className='size-[1.20rem]' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-96'>
							<DropdownMenuLabel>Notifications</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Notification 1</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Notification 2</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<UserDropdownMenu></UserDropdownMenu>
				</div>
			</nav>
		</header>
	);
}
