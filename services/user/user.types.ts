import {
	ACCEPTED_IMAGE_TYPES,
	IMAGE_FILE_LIMIT,
	messages,
	regex,
	RESTRICTED_USERNAMES
} from '@/config';
import { z } from 'zod';

export const ChangeUsernameSchema = z.object({
	username: z
		.string()
		.min(1, messages.required('Username'))
		.max(20, messages.max('Username', 20))
		.regex(regex.username, messages.usernameRegex)
		.refine(
			(username) => !RESTRICTED_USERNAMES.includes(username),
			messages.restrictedUsername
		)
});
export const ChangeImageSchema = z.object({
	image: z
		.instanceof(File, { message: messages.required('Image') })
		.refine((file) => file.size <= IMAGE_FILE_LIMIT, messages.imageMaxSize)
		.refine(
			(file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
			messages.imageTypes
		)
});

export type ChangeUsernameDto = z.infer<typeof ChangeUsernameSchema>;
export type ChangeImageDto = z.infer<typeof ChangeImageSchema>;

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
