'use client';

import Image from 'next/image';
import Link from 'next/link';
import { IMAGES_URL, SMALL_IMAGE_ENDING } from '@/config';
import { usePlayer } from '@/hooks/player';
import { useCurrentUserQuery } from '@/hooks/queries';
import { useMediaSession } from '@/hooks/use-media-session';
import { usePlayerKeyboard } from '@/hooks/use-player-keyboard';
import { formatTime } from '@/lib/utils';
import { useTrackStore } from '@/stores/track.store';
import { useTrackLocalStore } from '@/stores/track-local.store';
import {
	LikeTrackPlayerButton,
	PlayButton,
	RepeatButton,
	ShuffleButton,
	SkipBackButton,
	SkipForwardButton,
	VolumeButton
} from './PlayerButtons';
import { PlayerFooterLayout } from './PlayerFooterLayout';
import { TrackSlider, VolumeSlider } from './PlayerSliders';
import { QueuePanel } from './QueuePanel';

export default function Player() {
	const currentTime = useTrackLocalStore((state) => state.currentTime);
	const trackInfo = useTrackStore((state) => state.trackInfo);
	const audio = useTrackStore((state) => state.audio);
	const audioReady = useTrackStore((state) => state.audioReady);

	const { updateTime } = usePlayer();
	useMediaSession();
	usePlayerKeyboard();

	const currentUserQuery = useCurrentUserQuery();
	const currentUser = currentUserQuery.data?.data;

	if (!currentUser || !trackInfo || !audio) {
		return <PlayerFooterLayout></PlayerFooterLayout>;
	}

	const coverAlt = `${trackInfo.title} cover art`;

	return (
		<PlayerFooterLayout>
			<div className='flex h-full w-full min-w-0 items-center gap-4 sm:w-64'>
				<Link
					href={`/${trackInfo.username}/${trackInfo.changeableId}`}
					className='size-12 min-h-12 min-w-12 shrink-0 rounded-md border'
				>
					<Image
						alt={coverAlt}
						src={`${IMAGES_URL}/${trackInfo.image}${SMALL_IMAGE_ENDING}`}
						width={50}
						height={50}
						className='aspect-square size-12 min-h-12 min-w-12 rounded-md'
					/>
				</Link>
				<div className='flex min-w-0 flex-1 flex-col overflow-hidden text-sm sm:max-w-20 lg:max-w-28'>
					<Link
						className='truncate'
						href={`/${trackInfo.username}/${trackInfo.changeableId}`}
					>
						{trackInfo.title}
					</Link>
					<Link
						href={`/${trackInfo.username}`}
						className='truncate text-muted-foreground'
					>
						{trackInfo.username}
					</Link>
				</div>
				<LikeTrackPlayerButton />
			</div>
			<div className='flex h-full w-full flex-col items-center pt-1 sm:w-[48rem]'>
				<div className='flex justify-center gap-2'>
					<QueuePanel />
					<ShuffleButton />
					<SkipBackButton />
					<PlayButton />
					<SkipForwardButton />
					<RepeatButton />
				</div>
				<div className='flex w-full items-center justify-center gap-2 text-xs tabular-nums'>
					<span className='w-12 text-end'>
						{audioReady ? formatTime(currentTime) : '0:00'}
					</span>
					<TrackSlider updateTime={updateTime} />
					<span className='w-12'>{formatTime(trackInfo.duration)}</span>
				</div>
			</div>
			<div className='hidden h-full w-64 items-center justify-end gap-1 sm:flex'>
				<VolumeButton />
				<VolumeSlider />
			</div>
		</PlayerFooterLayout>
	);
}
