import {
	ACCEPTED_AUDIO_TYPES,
	ACCEPTED_IMAGE_TYPES,
	AUDIO_FILE_LIMIT,
	IMAGE_FILE_LIMIT,
	messages
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

export function shuffleArray(array: number[]) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

export function validateImage(file: File) {
	if (file.size > IMAGE_FILE_LIMIT) {
		throw new Error(messages.imageMaxSize);
	}
	if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
		throw new Error(messages.imageTypes);
	}
}

export function validateAudio(file: File) {
	if (file.size > AUDIO_FILE_LIMIT) {
		throw new Error(messages.audioMaxSize);
	}
	if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
		throw new Error(messages.audioTypes);
	}
}
