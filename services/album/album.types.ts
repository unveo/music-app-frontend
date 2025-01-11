import { z } from 'zod';
import {
	ACCEPTED_IMAGE_TYPES,
	IMAGE_FILE_LIMIT,
	messages,
	regex
} from '@/config';
import { TrackForAlbumSchema } from '../track/track.types';

type AlbumType = 'lp' | 'ep';
const AlbumTypes = ['lp', 'ep'] as const;

export const CreateAlbumSchema = z.object({
	title: z
		.string()
		.min(1, messages.required('Title'))
		.max(20, messages.max('Title', 20))
		.regex(regex.title, messages.titleRegex),
	changeableId: z
		.string()
		.min(1, messages.required('ChangeableId'))
		.max(20, messages.max('ChangeableId', 20))
		.regex(regex.changeableId, messages.changeableIdRegex),
	type: z.enum(AlbumTypes),
	image: z
		.instanceof(File, { message: messages.required('Image') })
		.refine((file) => file.size <= IMAGE_FILE_LIMIT, messages.imageMaxSize)
		.refine(
			(file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
			messages.imageTypes
		),
	tracks: z
		.array(TrackForAlbumSchema)
		.min(2, messages.albumTracks.amount)
		.refine(
			(tracks) => tracks.every((track) => track.audio),
			messages.albumTracks.audios
		)
		.refine((tracks) => {
			const titles: string[] = [];
			const changeableIds: string[] = [];

			tracks.map((track) => {
				titles.push(track.title), changeableIds.push(track.changeableId);
			});

			if (
				new Set(titles).size !== titles.length ||
				new Set(changeableIds).size !== changeableIds.length
			) {
				return false;
			}
			return true;
		}, messages.albumTracks.unique)
});

export const UpdateAlbumSchema = z.object({
	title: z
		.string()
		.min(1, messages.required('Title'))
		.max(20, messages.max('Title', 20))
		.regex(regex.title, messages.titleRegex)
		.optional(),
	changeableId: z
		.string()
		.min(1, messages.required('ChangeableId'))
		.max(20, messages.max('ChangeableId', 20))
		.regex(regex.changeableId, messages.changeableIdRegex)
		.optional(),
	type: z.enum(AlbumTypes).optional(),
	image: z
		.instanceof(File, { message: messages.required('Image') })
		.refine((file) => file.size <= IMAGE_FILE_LIMIT, messages.imageMaxSize)
		.refine(
			(file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
			messages.imageTypes
		)
		.optional()
});

export type CreateAlbumDto = z.infer<typeof CreateAlbumSchema>;
export type UpdateAlbumDto = z.infer<typeof UpdateAlbumSchema>;

export interface Album {
	id: number;
	title: string;
	changeableId: string;
	image: string;
	type: AlbumType;
	userId: number;
	username: string;
	createdAt: string;
	updatedAt: string;
}

export interface AlbumFull extends Album {
	_count: { tracks: number };
	likes: { addedAt: string }[];
}
