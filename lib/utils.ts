import {
	ACCEPTED_AUDIO_TYPES,
	ACCEPTED_IMAGE_TYPES,
	AUDIO_FILE_LIMIT,
	IMAGE_FILE_LIMIT
} from '@/config';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function nFormatter(num: number) {
	const lookup = [
		{ value: 1, symbol: '' },
		{ value: 1e3, symbol: 'k' },
		{ value: 1e6, symbol: 'M' },
		{ value: 1e9, symbol: 'G' }
	];
	const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
	const item = lookup.findLast((item) => num >= item.value);
	return item
		? (num / item.value).toString().replace(regexp, '').concat(item.symbol)
		: '0';
}

export function formatTime(time: number) {
	const truncatedTime = Math.trunc(time);
	const minutes = Math.trunc(truncatedTime / 60);
	let seconds = (truncatedTime % 60).toString();
	if (seconds.length === 1) {
		seconds = '0' + seconds;
	}
	return minutes + ':' + seconds;
}

export function validateImage(file: File) {
	if (file.size > IMAGE_FILE_LIMIT) {
		throw new Error('Max image file size is 10MB');
	}
	if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
		throw new Error('Only jpg and png files are supported');
	}
}

export function validateAudio(file: File) {
	if (file.size > AUDIO_FILE_LIMIT) {
		throw new Error('Max audio file size is 50MB');
	}
	if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
		throw new Error(
			'Only MP3, AAC, M4A, FLAC, WAV, AIFF, or WEBM files are supported'
		);
	}
}
