export const AUDIO_FILE_LIMIT = 52428800;
export const IMAGE_FILE_LIMIT = 10485760;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
export const ACCEPTED_AUDIO_TYPES = [
	'audio/mpeg',
	'audio/vnd.dlna.adts',
	'audio/flac',
	'audio/wav',
	'audio/aiff',
	'audio/webm',
	'video/webm'
];
export const RESTRICTED_USERNAMES = [
	'login',
	'signup',
	'logout',
	'library',
	'upload',
	'settings',
	'api'
];
export const regex = {
	title: /^[^\s][\s\S]*$/,
	password: /^[\w!@#$%^&*?-]*$/,
	username: /^[a-z0-9][a-z0-9_-]*$/,
	changeableId: /^[a-z0-9][a-z0-9_-]*$/
};
export const messages = {
	titleRegex: 'Title cannot start with a space',
	passwordRegex: 'Password can only contain letters, numbers and !@#$%^&*?-_',
	usernameRegex:
		'username can only contain lowercase letters, numbers, hyphens, underscores and cannot start with a hyphen or underscore',
	changeableIdRegex:
		'changeableId can only contain lowercase letters, numbers, hyphens, underscores and cannot start with a hyphen or underscore',
	min: (word: string, number: number) =>
		`${word} must contain at least ${number} character(s)`,
	max: (word: string, number: number) =>
		`${word} must contain at most ${number} character(s)`,
	required: (word: string) => `${word} is required`,
	imageMaxSize: 'Max image file size is 10MB',
	imageTypes: 'Only jpg and png files are supported',
	audioMaxSize: 'Max audio file size is 50MB',
	audioTypes: 'Only mp3, aac, flac, wav, aiff and webm files are supported',
	restrictedUsername: 'This username is not available',
	emailValid: 'This email is not valid',
	albumTracks: {
		amount: 'There must be at least two tracks',
		audios: 'Each track must have an audio file',
		unique: 'Track titles and ids must be unique'
	}
};
export const baseUrl = {
	frontend: process.env.NEXT_PUBLIC_FRONTEND_URL,
	backend: process.env.NEXT_PUBLIC_BACKEND_URL
};
export const IMAGES_URL = process.env.NEXT_PUBLIC_IMAGES_URL;
export const AUDIO_URL = process.env.NEXT_PUBLIC_AUDIO_URL;
export const REFRESH_TOKEN = 'refreshToken';
export const MS_TO_ADD_LISTEN = 10000;
export const SMALL_IMAGE_ENDING = '_50x50.jpg';
export const LARGE_IMAGE_ENDING = '_250x250.jpg';
export const AUDIO_ENDING = '.webm';
