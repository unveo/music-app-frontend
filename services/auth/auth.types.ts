import { messages, regex, restrictedUsernames } from '@/config';
import { z } from 'zod';

export const LoginSchema = z.object({
	email: z.string().email(messages.emailValid),
	password: z
		.string()
		.min(5, messages.min('Password', 5))
		.max(50, messages.max('Password', 50))
		.regex(regex.password, messages.passwordRegex)
});

export const RegisterSchema = z.object({
	email: z.string().email(messages.emailValid),
	username: z
		.string()
		.min(1, messages.min('Password', 1))
		.max(20, messages.max('Password', 20))
		.regex(regex.username, messages.usernameRegex)
		.refine(
			(username) => !restrictedUsernames.includes(username),
			messages.restrictedUsername
		),
	password: z
		.string()
		.min(5, messages.min('Password', 5))
		.max(50, messages.max('Password', 50))
		.regex(regex.password, messages.passwordRegex)
});

export const ChangeEmailSchema = z.object({
	email: z.string().email(messages.emailValid)
});

export const ChangePasswordSchema = z.object({
	oldPassword: z
		.string()
		.min(5, messages.min('Password', 5))
		.max(50, messages.max('Password', 50))
		.regex(regex.password, messages.passwordRegex),
	newPassword: z
		.string()
		.min(5, messages.min('Password', 5))
		.max(50, messages.max('Password', 50))
		.regex(regex.password, messages.passwordRegex)
});

export type LoginDto = z.infer<typeof LoginSchema>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type ChangeEmailDto = z.infer<typeof ChangeEmailSchema>;
export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;
