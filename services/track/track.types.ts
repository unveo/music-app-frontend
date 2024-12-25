import {
	ACCEPTED_AUDIO_TYPES,
	ACCEPTED_IMAGE_TYPES,
	AUDIO_FILE_LIMIT,
	IMAGE_FILE_LIMIT,
	messages,
	regex
} from '@/config';
import { z } from 'zod';

export const UploadTrackSchema = z.object({
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
		),
	audio: z
		.instanceof(File, { message: messages.required('Audio') })
		.refine((file) => file.size <= AUDIO_FILE_LIMIT, messages.audioMaxSize)
		.refine(
			(file) => ACCEPTED_AUDIO_TYPES.includes(file.type),
			messages.audioTypes
		)
});

export const UpdateTrackSchema = z.object({
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

export type UploadTrackDto = z.infer<typeof UploadTrackSchema>;
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
	username: string;
	likes: { addedAt: string }[];
	createdAt: string;
	updatedAt: string;
}

export interface TracksCreatedCount {
	count: number;
}

export interface TracksIds {
	prevIds: number[];
	nextIds: number[];
}
