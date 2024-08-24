import { regex, restrictedUsernames } from '@/config';
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(5)
    .max(50)
    .regex(regex.password, regex.passwordMessage)
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(1)
    .max(20)
    .regex(regex.username, regex.usernameMessage)
    .refine((username) => !restrictedUsernames.includes(username)),
  password: z
    .string()
    .min(5)
    .max(50)
    .regex(regex.password, regex.passwordMessage)
});

export const ChangeEmailSchema = z.object({ email: z.string().email() });

export const ChangePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(5)
    .max(50)
    .regex(regex.password, regex.passwordMessage),
  newPassword: z
    .string()
    .min(5)
    .max(50)
    .regex(regex.password, regex.passwordMessage)
});

export type LoginDto = z.infer<typeof LoginSchema>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type ChangeEmailDto = z.infer<typeof ChangeEmailSchema>;
export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;
