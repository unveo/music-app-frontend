'use client';

import { GlobalPlaylistsSection, UsersSection } from '@/components/Sections';
import useCardsCount from '@/hooks/cards-count';

export default function Home() {
	useCardsCount();

	return (
		<div className='p-8'>
			<ul className='flex flex-col gap-12'>
				<UsersSection></UsersSection>
			</ul>
		</div>
	);
}
