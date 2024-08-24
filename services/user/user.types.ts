import {
	ACCEPTED_IMAGE_TYPES,
	IMAGE_FILE_LIMIT,
	regex,
	restrictedUsernames
} from '@/config';
import { z } from 'zod';

export const UpdateUserSchema = z.object({
	username: z
		.string()
		.min(1)
		.max(20)
		.regex(regex.username, regex.usernameMessage)
		.refine((username) => !restrictedUsernames.includes(username))
		.optional(),
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

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

export interface UserWithoutFollowingCount {
	id: number;
	username: string;
	image: string;
	_count: { followers: number };
}

export interface UserPublic extends UserWithoutFollowingCount {
	_count: { followers: number; following: number };
}

export interface UserPrivate extends UserWithoutFollowingCount {
	email: string;
	createdAt: string;
	updatedAt: string;
}
