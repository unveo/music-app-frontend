import {
	ACCEPTED_AUDIO_TYPES,
	ACCEPTED_IMAGE_TYPES,
	AUDIO_FILE_LIMIT,
	IMAGE_FILE_LIMIT,
	regex
} from '@/config';
import { z } from 'zod';

export const UploadTrackSchema = z.object({
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
	image: z.any().refine((file) => file, 'Image is required'),
	audio: z.any().refine((file) => file, 'Audio is required')
});

export const UploadTracksSchema = z.object({
	tracks: z.array(UploadTrackSchema),
	audios: z.any() // TODO
});

export const UpdateTrackSchema = z.object({
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
	image: z
		.any()
		.refine((files) => {
			console.log(typeof files);
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

export type UploadTrackDto = z.infer<typeof UploadTrackSchema>;
export type UploadTracksDto = z.infer<typeof UploadTracksSchema>;
export type UpdateTrackDto = z.infer<typeof UpdateTrackSchema>;

export interface Track {
	id: number;
	changeableId: string;
	title: string;
	duration: number;
	plays: number;
	audio: string;
	image: string;
	userId: number;
	createdAt: string;
	updatedAt: string;
}

export interface TrackWithUsername extends Track {
	user: { username: string };
}

export interface TracksCreatedCount {
	count: number;
}
