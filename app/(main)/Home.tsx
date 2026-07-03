'use client';

import {
	LikedTracksHomeSection,
	RecentHistorySection,
	RecommendedSection
} from '@/components/Sections';

export default function Home() {
	return (
		<div className='p-8'>
			<ul className='flex flex-col gap-12'>
				<RecentHistorySection />
				<LikedTracksHomeSection />
				<RecommendedSection />
			</ul>
		</div>
	);
}
