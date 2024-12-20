import { z } from 'zod';
import { ACCEPTED_IMAGE_TYPES, IMAGE_FILE_LIMIT, regex } from '@/config';

type AlbumType = 'lp' | 'ep';
const AlbumTypes = ['lp', 'ep'] as const;

export const CreateAlbumSchema = z.object({
	title: z
		.string()
		.min(1, 'This field is required')
		.max(20, 'Max characters - 20')
		.regex(regex.title, regex.titleMessage),
	changeableId: z
		.string()
		.min(1, 'This field is required')
		.max(20, 'Max characters - 20')
		.regex(regex.changeableId, regex.changeableIdMessage),
	type: z.enum(AlbumTypes),
	tracks: z.array(
		z.object({
			trackId: z.number(),
			position: z.number(),
			firstUpload: z.boolean()
		})
	),
	image: z
		.any()
		.refine((files) => {
			files?.length === 1;
		}, 'Image is required')
		.refine(
			(files) => files?.[0]?.size <= IMAGE_FILE_LIMIT,
			`Max image file size is 10MB.`
		)
		.refine(
			(files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
			'only jpg and png files are supported'
		)
});

export const UpdateAlbumSchema = z.object({
	title: z
		.string()
		.min(1, 'This field is required')
		.max(20, 'Max characters - 20')
		.regex(regex.title, regex.titleMessage)
		.optional(),
	changeableId: z
		.string()
		.min(1, 'This field is required')
		.max(20, 'Max characters - 20')
		.regex(regex.changeableId, regex.changeableIdMessage)
		.optional(),
	type: z.enum(AlbumTypes).optional(),
	image: z
		.any()
		.refine((files) => {
			files?.length === 1;
		}, 'Image is required')
		.refine(
			(files) => files?.[0]?.size <= IMAGE_FILE_LIMIT,
			`Max image file size is 10MB.`
		)
		.refine(
			(files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
			'only jpg and png files are supported'
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
	_count: { likes: number; tracks: number };
}
