import { z } from 'zod';
import {
	ACCEPTED_IMAGE_TYPES,
	IMAGE_FILE_LIMIT,
	messages,
	regex
} from '@/config';

export const CreatePlaylistSchema = z.object({
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
	image: z
		.instanceof(File, { message: messages.required('Image') })
		.refine((file) => file.size <= IMAGE_FILE_LIMIT, messages.imageMaxSize)
		.refine(
			(file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
			messages.imageTypes
		)
});

export const UpdatePlaylistSchema = z.object({
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
	image: z
		.instanceof(File, { message: messages.required('Image') })
		.refine((file) => file.size <= IMAGE_FILE_LIMIT, messages.imageMaxSize)
		.refine(
			(file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
			messages.imageTypes
		)
		.optional()
});

export type CreatePlaylistDto = z.infer<typeof CreatePlaylistSchema>;

export type UpdatePlaylistDto = z.infer<typeof UpdatePlaylistSchema>;

export interface Playlist {
	id: number;
	title: string;
	changeableId: string;
	image: string;
	userId: number;
	username: string;
	createdAt: string;
	updatedAt: string;
}

export interface PlaylistFull extends Playlist {
	_count: { tracks: number };
	savedByUsers: { addedAt: string }[];
}
