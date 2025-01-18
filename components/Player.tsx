'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatTime } from '@/lib/utils';
import { useTrackLocalStore } from '@/stores/track-local.store';
import { useTrackStore } from '@/stores/track.store';
import { IMAGES_URL, SMALL_IMAGE_ENDING } from '@/config';
import { useCurrentUserQuery } from '@/hooks/queries';
import {
	LikeTrackPlayerButton,
	PlayButton,
	RepeatButton,
	ShuffleButton,
	SkipBackButton,
	SkipForwardButton,
	VolumeButton
} from './PlayerButtons';
import { TrackSlider, VolumeSlider } from './PlayerSliders';
import { usePlayer } from '@/hooks/player';

export default function Player() {
	const { currentTime } = useTrackLocalStore();
	const { trackInfo, audio, audioReady } = useTrackStore();

	const { updateTime } = usePlayer();

	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	if (!currentUser || !trackInfo || !audio) {
		return <FooterLayout></FooterLayout>;
	}

	return (
		<FooterLayout>
			<div className='flex h-full items-center gap-4'>
				<Link
					href={`/${trackInfo.username}/${trackInfo.changeableId}`}
					className='size-12 min-h-12 min-w-12 rounded-md border'
				>
					<Image
						priority
						alt='cover'
						src={`${IMAGES_URL}/${trackInfo.image}${SMALL_IMAGE_ENDING}`}
						width={50}
						height={50}
						className='aspect-square size-12 rounded-md'
					/>
				</Link>
				<div className='flex min-w-8 max-w-20 flex-col overflow-hidden text-sm lg:max-w-28'>
					<Link
						className='overflow-hidden whitespace-nowrap'
						href={`/${trackInfo.username}/${trackInfo.changeableId}`}
					>
						{trackInfo.title}
					</Link>
					<Link
						href={`/${trackInfo.username}`}
						className='overflow-hidden whitespace-nowrap text-muted-foreground'
					>
						{trackInfo.username}
					</Link>
				</div>
				<LikeTrackPlayerButton />
			</div>
			<div className='col-start-2 col-end-5 flex h-full flex-col items-center pt-1'>
				<div className='flex justify-center gap-2'>
					<ShuffleButton />
					<SkipBackButton />
					<PlayButton />
					<SkipForwardButton />
					<RepeatButton />
				</div>
				<div className='flex items-center justify-center gap-2 text-xs'>
					<span className='w-12 text-end'>
						{audioReady ? formatTime(currentTime) : '0:00'}
					</span>
					<TrackSlider updateTime={updateTime} />
					<span className='w-12'>{formatTime(trackInfo.duration)}</span>
				</div>
			</div>
			<div className='col-start-5 flex h-full items-center justify-end gap-1'>
				<VolumeButton />
				<VolumeSlider />
			</div>
		</FooterLayout>
	);
}

function FooterLayout({
	children
}: Readonly<{
	children?: React.ReactNode;
}>) {
	return (
		<footer className='sticky bottom-0 flex h-16 max-h-16 min-h-16 justify-center border-t bg-background'>
			<div className='grid h-full w-full max-w-[80rem] grid-cols-5 items-center px-2'>
				{children}
			</div>
		</footer>
	);
}
