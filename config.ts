export const AUDIO_FILE_LIMIT = 52428800;
export const IMAGE_FILE_LIMIT = 10485760;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
export const ACCEPTED_AUDIO_TYPES = [
	'audio/mpeg',
	'audio/aac',
	'audio/mp4',
	'audio/flac',
	'audio/wav',
	'audio/aiff',
	'audio/webm'
]; // m4a check, webm check
export const restrictedUsernames = [
	'login',
	'signup',
	'logout',
	'library',
	'upload',
	'settings'
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
	audioTypes:
		'Only mp3, aac, m4a, flac, wav, aiff and webm files are supported',
	restrictedUsername: 'This username is not available',
	emailValid: 'This email is not valid'
};
export const baseUrl = {
	frontend: 'http://localhost:3000',
	backend: 'http://localhost:5000'
};
export const REFRESH_TOKEN = 'refreshToken';
export const msToAddListen = 10000;
export const imageFormat = '.jpg';
