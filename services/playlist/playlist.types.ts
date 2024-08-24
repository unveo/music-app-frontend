import { z } from 'zod';
import { ACCEPTED_IMAGE_TYPES, IMAGE_FILE_LIMIT, regex } from '@/config';

export const CreatePlaylistSchema = z.object({
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

export const UpdatePlaylistSchema = z.object({
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

export type CreatePlaylistDto = z.infer<typeof CreatePlaylistSchema>;

export type UpdatePlaylistDto = z.infer<typeof UpdatePlaylistSchema>;

export interface Playlist {
  id: number;
  title: string;
  changeableId: string;
  image: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistWithUsername extends Playlist {
  user: {
    username: string;
  };
}

export interface PlaylistFull extends Playlist {
  _count: { savedByUsers: number; tracks: number };
}
