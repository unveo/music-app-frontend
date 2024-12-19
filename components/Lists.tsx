'use client';

import { CardSkeleton } from './Cards';
import Link from 'next/link';

export function List({
	username,
	name,
	children
}: {
	username: string;
	name: string;
	children: React.ReactNode;
}) {
	return (
		<div className='flex flex-col gap-4 p-8'>
			<div className='flex items-end'>
				<h2 className='text-2xl'>
					<Link href='./' className='font-semibold'>
						{username}
					</Link>
					<span>{` ${name}`}</span>
				</h2>
			</div>
			<div>
				<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
					{children}
				</ul>
			</div>
		</div>
	);
}

export function ListSkeleton() {
	const cards = Array(18).fill(0);

	return (
		<div className='flex flex-col gap-4 p-8'>
			<div className='flex items-end'>
				<div className='h-8 w-36 rounded-md bg-skeleton'></div>
			</div>
			<div>
				<ul className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
					{cards.map((value, index) => (
						<CardSkeleton key={index}></CardSkeleton>
					))}
				</ul>
			</div>
		</div>
	);
}
