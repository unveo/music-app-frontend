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

export function getTake(innerWidth: number) {
	if (innerWidth >= 1024) {
		return 6;
	} else if (innerWidth >= 768) {
		return 5;
	} else if (innerWidth >= 640) {
		return 4;
	} else {
		return 3;
	}
}
