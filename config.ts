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
	titleMessage: 'Title cannot start with a space',
	password: /^[\w!@#$%^&*?-]*$/,
	passwordMessage: 'Password can only contain letters, numbers and !@#$%^&*?-_',
	username: /^[a-z0-9][a-z0-9_-]*$/,
	usernameMessage:
		'username can only contain lowercase letters, numbers, hyphens, underscores and cannot start with a hyphen or underscore',
	changeableId: /^[a-z0-9][a-z0-9_-]*$/,
	changeableIdMessage:
		'changeableId can only contain lowercase letters, numbers, hyphens, underscores and cannot start with a hyphen or underscore'
};
