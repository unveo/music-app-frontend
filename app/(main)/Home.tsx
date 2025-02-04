'use client';

import { RecommendedSection } from '@/components/Sections';

export default function Home() {
	return (
		<div className='p-8'>
			<ul className='flex flex-col gap-12'>
				<RecommendedSection></RecommendedSection>
			</ul>
		</div>
	);
}
