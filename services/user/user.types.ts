import { regex, restrictedUsernames } from '@/config';
import { z } from 'zod';

export const ChangeUsernameSchema = z.object({
	username: z
		.string()
		.min(1)
		.max(20)
		.regex(regex.username, regex.usernameMessage)
		.refine((username) => !restrictedUsernames.includes(username))
});
export const ChangeImageSchema = z.object({
	image: z.any().refine((file) => file, { message: 'Image is required' })
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
