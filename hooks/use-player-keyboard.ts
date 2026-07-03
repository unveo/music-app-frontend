'use client';

import { useEffect } from 'react';
import { usePlayTrackActions } from '@/hooks/play-track';
import { useSettingsStore } from '@/stores/settings.store';
import { useTrackStore } from '@/stores/track.store';

export function usePlayerKeyboard() {
	const { onClickPlay, onClickSkipBack, onClickSkipForward } =
		usePlayTrackActions();
	const { muted, setMuted } = useSettingsStore();
	const audio = useTrackStore((state) => state.audio);

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			const activeElement = document.activeElement;

			if (
				activeElement instanceof HTMLInputElement ||
				activeElement instanceof HTMLTextAreaElement ||
				activeElement instanceof HTMLSelectElement ||
				activeElement?.getAttribute('contenteditable') === 'true'
			) {
				return;
			}

			if (event.code === 'ArrowRight' && event.shiftKey) {
				event.preventDefault();
				onClickSkipForward();
				return;
			}

			if (event.code === 'ArrowLeft' && event.shiftKey) {
				event.preventDefault();
				onClickSkipBack();
				return;
			}

			if (event.code === 'KeyM' && audio) {
				event.preventDefault();
				setMuted(!muted);
				audio.volume = muted ? useSettingsStore.getState().volume : 0;
			}
		}

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [
		audio,
		muted,
		onClickSkipBack,
		onClickSkipForward,
		onClickPlay,
		setMuted
	]);
}
