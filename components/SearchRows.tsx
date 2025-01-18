import { IMAGES_URL, LARGE_IMAGE_ENDING } from '@/config';
import { nFormatter } from '@/lib/utils';
import { Album } from '@/services/album/album.types';
import { Track } from '@/services/track/track.types';
import { UserPublic } from '@/services/user/user.types';
import Image from 'next/image';
import Link from 'next/link';

export function UserRow({ user }: { user: UserPublic }) {
	return (
		<li className='flex flex-col gap-2'>
			<div className='group relative rounded-full border'>
				<Link href={`/${user.username}`} className='aspect-square rounded-full'>
					<Image
						alt='User image'
						src={`${IMAGES_URL}/${user.image}${LARGE_IMAGE_ENDING}`}
						width={250}
						height={250}
						priority
						className='aspect-square rounded-full'
					></Image>
				</Link>
			</div>
			<div className='flex flex-col items-center'>
				<Link href={`/${user.username}`} className='max-w-full truncate'>
					{user.username}
				</Link>
				<span className='max-w-full truncate text-muted-foreground'>
					{`${nFormatter(user._count.followers)} followers`}
				</span>
			</div>
		</li>
	);
}

export function AlbumRow({ album }: { album: Album }) {
	return (
		<li className='flex flex-col gap-2'>
			<div className='group relative rounded-md border'>
				<Link
					href={`/${album.username}/albums/${album.changeableId}`}
					className='aspect-square rounded-md'
				>
					<Image
						alt='User image'
						src={`${IMAGES_URL}/${album.image}${LARGE_IMAGE_ENDING}`}
						width={250}
						height={250}
						priority
						className='aspect-square rounded-md'
					></Image>
				</Link>
			</div>
			<div className='flex flex-col'>
				<Link
					href={`/${album.username}/albums/${album.changeableId}`}
					className='max-w-full truncate'
				>
					{album.title}
				</Link>
				<Link
					href={`/${album.username}`}
					className='max-w-full truncate text-muted-foreground'
				>
					{album.username}
				</Link>
			</div>
		</li>
	);
}

export function TrackRow({ track }: { track: Track }) {
	return (
		<li className='flex flex-col gap-2'>
			<div className='group relative rounded-md border'>
				<Link
					href={`/${track.username}/${track.changeableId}`}
					className='aspect-square rounded-md'
				>
					<Image
						alt='User image'
						src={`${IMAGES_URL}/${track.image}${LARGE_IMAGE_ENDING}`}
						width={250}
						height={250}
						priority
						className='aspect-square rounded-md'
					></Image>
				</Link>
			</div>
			<div className='flex flex-col'>
				<Link
					href={`/${track.username}/${track.changeableId}`}
					className='max-w-full truncate'
				>
					{track.title}
				</Link>
				<Link
					href={`/${track.username}`}
					className='max-w-full truncate text-muted-foreground'
				>
					{track.username}
				</Link>
			</div>
		</li>
	);
}
