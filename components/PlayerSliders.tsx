'use client';

import { Slider } from '@/components/ui/slider';
import { useSettingsStore } from '@/stores/settings.store';
import { useTrackLocalStore } from '@/stores/track-local.store';
import { useTrackStore } from '@/stores/track.store';
import type { SliderValueChangeDetails } from '@ark-ui/react';

export function TrackSlider({ updateTime }: { updateTime: () => void }) {
	const { setCurrentTime } = useTrackLocalStore();
	const { audio, audioReady, progress, setProgress, setIsSeeking } =
		useTrackStore();

	function onPointerDown() {
		if (audio) {
			setIsSeeking(true);
			audio.removeEventListener('timeupdate', updateTime);
		}
	}

	function onTrackSliderChange(details: SliderValueChangeDetails) {
		if (audio) {
			setCurrentTime(details.value[0] * audio.duration);
			setProgress(details.value[0]);
		}
	}

	function onTrackSliderChangeEnd(details: SliderValueChangeDetails) {
		if (audio) {
			setIsSeeking(false);
			audio.currentTime = details.value[0] * audio.duration;
		}
	}

	return (
		<Slider
			value={[progress]}
			onPointerDown={onPointerDown}
			onValueChange={onTrackSliderChange}
			onValueChangeEnd={onTrackSliderChangeEnd}
			max={1}
			step={0.01}
			disabled={audioReady ? false : true}
			className='w-full sm:w-52 md:w-80 lg:w-[26rem]'
		/>
	);
}

export function VolumeSlider() {
	const { volume, muted, setVolume, setMuted } = useSettingsStore();
	const { audio } = useTrackStore();

	function onVolumeChange(details: SliderValueChangeDetails) {
		if (muted) {
			setMuted(false);
		}

		setVolume(details.value[0]);

		if (audio) {
			audio.volume = details.value[0];
		}
	}

	return (
		<Slider
			value={[muted ? 0 : volume]}
			onValueChange={onVolumeChange}
			max={1}
			step={0.01}
			className='w-16 md:w-20 lg:w-28'
		/>
	);
}
