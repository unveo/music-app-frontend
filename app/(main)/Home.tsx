'use client';

import {
	GlobalPlaylistsSection,
	ListeningHistorySection,
	UsersSection
} from '@/components/Sections';
import useCardsCount from '@/lib/hooks/cards-count';

export default function Home() {
	useCardsCount();

	return (
		<div className='p-8'>
			<ul className='flex flex-col gap-12'>
				<ListeningHistorySection></ListeningHistorySection>
				<UsersSection></UsersSection>
				<GlobalPlaylistsSection></GlobalPlaylistsSection>
			</ul>
		</div>
	);
}
