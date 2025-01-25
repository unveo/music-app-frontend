'use client';

import { AUDIO_ENDING, AUDIO_URL } from '@/config';
import { trackService } from '@/services/track/track.service';
import { Track } from '@/services/track/track.types';
import { useListenTimeStore } from '@/stores/listen-time.store';
import { useQueueStore } from '@/stores/queue.store';
import { useSettingsStore } from '@/stores/settings.store';
import { useTrackLocalStore } from '@/stores/track-local.store';
import { useTrackStore } from '@/stores/track.store';
import { useAddToHistoryMut } from './mutations';
import { likedTrackService } from '@/services/user/liked-track/liked-track.service';
import { playlistTrackService } from '@/services/playlist/playlist-track/playlist-track.service';
import { albumTrackService } from '@/services/album/album-track/album-track.service';
import { shuffleArray } from '@/lib/utils';

export function usePlayTrack() {
	const {
		isPlaying,
		audio,
		audioReady,
		setIsPlaying,
		setTrackInfo,
		setAudio,
		setAudioReady,
		setProgress
	} = useTrackStore();
	const { trackId, setTrackId, setCurrentTime } = useTrackLocalStore();
	const { type, queueId, setNext, setPrev, setType, setQueueId, setAll } =
		useQueueStore();
	const { setListenTime, setStartTime } = useListenTimeStore();
	const { shuffle, repeat, setShuffle, setRepeat } = useSettingsStore();

	const addToHistoryMutation = useAddToHistoryMut();

	function onCanPlayThrough(this: HTMLAudioElement) {
		if (!useTrackStore.getState().audioReady) {
			setAudioReady(true);
			playAudio(this);
		}
	}

	async function onEnded(this: HTMLAudioElement) {
		const prev = useQueueStore.getState().prev;
		const next = useQueueStore.getState().next;
		const trackId = useTrackLocalStore.getState().trackId;
		const audio = useTrackStore.getState().audio;
		const repeat = useSettingsStore.getState().repeat;

		if (repeat === 'one' && audio) {
			playAudio(audio);
			return;
		}

		if (!prev.length && !next.length && audio) {
			if (repeat === 'full') {
				playAudio(audio);
			} else {
				setIsPlaying(false);
				this.currentTime = 0;
			}
			return;
		}

		if (!next.length) {
			if (repeat === 'full') {
				const track = await trackService.getOneById(prev[0]);

				setNewAudio(track.data);

				if (trackId) {
					setNext([...prev.slice(1), trackId]);
				}
				setPrev([]);

				addToHistoryMutation.mutate(prev[0]);
			} else {
				setIsPlaying(false);
				this.currentTime = 0;
			}
		} else {
			const track = await trackService.getOneById(next[0]);

			setNewAudio(track.data);

			setNext(next.slice(1));
			if (trackId) {
				setPrev([...prev, trackId]);
			}

			addToHistoryMutation.mutate(next[0]);
		}
	}

	function playAudio(audio: HTMLAudioElement) {
		audio.play();
		setIsPlaying(true);
	}

	function pauseAudio(audio: HTMLAudioElement) {
		audio.pause();
		setIsPlaying(false);
	}

	function setNewAudio(newTrackInfo: Track) {
		const audio = useTrackStore.getState().audio;

		if (audio) {
			audio.removeEventListener('canplaythrough', onCanPlayThrough);
			audio.removeEventListener('ended', onEnded);
		}

		const newAudio = new Audio(
			`${AUDIO_URL}/${newTrackInfo.audio}${AUDIO_ENDING}`
		);

		setAudioReady(false);
		setCurrentTime(0);
		setProgress(0);
		setAudio(newAudio);
		setTrackInfo(newTrackInfo);
		setTrackId(newTrackInfo.id);
		setListenTime(0);
		setStartTime(undefined);

		newAudio.addEventListener('canplaythrough', onCanPlayThrough);
		newAudio.addEventListener('ended', onEnded);
	}

	async function setUserQueue(userId: number, trackId: number) {
		const tracksIds = await trackService.getManyIds(userId, trackId);

		setPrev(tracksIds.data.prevIds);
		setNext(tracksIds.data.nextIds);
		setType('user');
		setQueueId(userId);
	}

	async function setLikedQueue(trackId: number) {
		const tracksIds = await likedTrackService.getManyIds(trackId);

		setPrev(tracksIds.data.prevIds);
		setNext(tracksIds.data.nextIds);
		setType('liked');
		setQueueId(0);
	}

	async function setPlaylistQueue(playlistId: number, position: number) {
		const tracksIds = await playlistTrackService.getManyIds(
			playlistId,
			position
		);

		setPrev(tracksIds.data.prevIds);
		setNext(tracksIds.data.nextIds);
		setType('playlist');
		setQueueId(playlistId);
	}

	async function setAlbumQueue(albumId: number, position: number) {
		const tracksIds = await albumTrackService.getManyIds(albumId, position);

		setPrev(tracksIds.data.prevIds);
		setNext(tracksIds.data.nextIds);
		setType('album');
		setQueueId(albumId);
	}

	function onClickPlay() {
		const isPlaying = useTrackStore.getState().isPlaying;

		if (!audio) {
			return;
		}

		if (isPlaying) {
			pauseAudio(audio);
		} else {
			playAudio(audio);
		}
	}

	async function onClickSkipBack() {
		const prev = useQueueStore.getState().prev;
		const next = useQueueStore.getState().next;
		const repeat = useSettingsStore.getState().repeat;
		const isPlaying = useTrackStore.getState().isPlaying;

		if (!audio) {
			return;
		}

		if (isPlaying) {
			audio.pause();
		}

		if (audio.currentTime >= 5) {
			audio.currentTime = 0;
			playAudio(audio);
			return;
		}

		if (!prev.length && !next.length) {
			audio.currentTime = 0;

			if (repeat === 'full' || repeat === 'one') {
				playAudio(audio);
			} else {
				setIsPlaying(false);
			}
			return;
		}

		if (!prev.length) {
			if (repeat === 'full') {
				const track = await trackService.getOneById(next[next.length - 1]);

				setNewAudio(track.data);
				setNext([]);
				if (trackId) {
					const newPrev = [trackId, ...next];
					newPrev.pop();
					setPrev(newPrev);
				}

				addToHistoryMutation.mutate(track.data.id);
			} else {
				audio.currentTime = 0;
				playAudio(audio);
			}
		} else {
			const track = await trackService.getOneById(prev[prev.length - 1]);

			setNewAudio(track.data);
			if (trackId) {
				setNext([trackId, ...next]);
			}
			setPrev(prev.slice(0, -1));

			addToHistoryMutation.mutate(track.data.id);
		}
	}

	async function onClickSkipForward() {
		const prev = useQueueStore.getState().prev;
		const next = useQueueStore.getState().next;
		const trackId = useTrackLocalStore.getState().trackId;
		const isPlaying = useTrackStore.getState().isPlaying;
		const repeat = useSettingsStore.getState().repeat;

		if (!audio) {
			return;
		}

		if (isPlaying) {
			audio.pause();
		}

		if (!prev.length && !next.length) {
			audio.currentTime = 0;

			if (repeat === 'full' || repeat === 'one') {
				playAudio(audio);
			} else {
				setIsPlaying(false);
			}
			return;
		}

		if (!next.length) {
			if (repeat === 'full') {
				const track = await trackService.getOneById(prev[0]);

				setNewAudio(track.data);

				if (trackId) {
					setNext([...prev.slice(1), trackId]);
				}
				setPrev([]);

				addToHistoryMutation.mutate(prev[0]);
			} else {
				setIsPlaying(false);
				audio.currentTime = 0;
			}
		} else {
			const track = await trackService.getOneById(next[0]);

			setNewAudio(track.data);

			setNext(next.slice(1));
			if (trackId) {
				setPrev([...prev, trackId]);
			}

			addToHistoryMutation.mutate(next[0]);
		}
	}

	function onClickShuffle() {
		const trackId = useTrackLocalStore.getState().trackId;
		const shuffle = useSettingsStore.getState().shuffle;

		if (shuffle) {
			setShuffle(false);
			const all = useQueueStore.getState().all;

			if (trackId) {
				const trackIndex = all.indexOf(trackId);

				setPrev(all.slice(0, trackIndex));
				setNext(all.slice(trackIndex + 1));
			}

			setAll([]);
		} else {
			setShuffle(true);

			const prev = useQueueStore.getState().prev;
			const next = useQueueStore.getState().next;
			const newNext = [...prev, ...next];

			shuffleArray(newNext);
			setPrev([]);
			setNext(newNext);

			if (trackId) {
				setAll([...prev, trackId, ...next]);
			}
		}
	}

	function onClickRepeat() {
		const repeat = useSettingsStore.getState().repeat;

		if (!repeat) {
			setRepeat('full');
		} else if (repeat === 'full') {
			setRepeat('one');
		} else {
			setRepeat(false);
		}
	}

	async function onClickUserTrack(track: Track) {
		const trackInfo = useTrackStore.getState().trackInfo;

		if (
			!trackInfo ||
			trackInfo.id !== track.id ||
			type !== 'user' ||
			queueId !== track.userId
		) {
			if (isPlaying && audio) {
				audio.pause();
			}

			setNewAudio(track);
			setUserQueue(track.userId, track.id);

			addToHistoryMutation.mutate(track.id);
		} else {
			if (audio) {
				if (!isPlaying) {
					playAudio(audio);
				} else {
					pauseAudio(audio);
				}
			}
		}
	}

	async function onClickUser(track: Track) {
		const queueId = useQueueStore.getState().queueId;
		const type = useQueueStore.getState().type;
		const trackInfo = useTrackStore.getState().trackInfo;

		if (!trackInfo || type !== 'user' || queueId !== track.userId) {
			if (isPlaying && audio) {
				audio.pause();
			}

			setNewAudio(track);
			setUserQueue(track.userId, track.id);

			addToHistoryMutation.mutate(track.id);
		} else {
			if (audio) {
				if (!isPlaying) {
					playAudio(audio);
				} else {
					pauseAudio(audio);
				}
			}
		}
	}

	async function onClickLikedTrack(track: Track) {
		const trackInfo = useTrackStore.getState().trackInfo;

		if (!trackInfo || trackInfo.id !== track.id || type !== 'liked') {
			if (isPlaying && audio) {
				audio.pause();
			}

			setNewAudio(track);
			setLikedQueue(track.id);

			addToHistoryMutation.mutate(track.id);
		} else {
			if (audio) {
				if (!isPlaying) {
					playAudio(audio);
				} else {
					pauseAudio(audio);
				}
			}
		}
	}

	async function onClickPlaylistTrack(
		track: Track,
		playlistId: number,
		position: number
	) {
		const trackInfo = useTrackStore.getState().trackInfo;

		if (
			!trackInfo ||
			trackInfo.id !== track.id ||
			type !== 'playlist' ||
			queueId !== playlistId
		) {
			if (isPlaying && audio) {
				audio.pause();
			}

			setNewAudio(track);
			setPlaylistQueue(playlistId, position);

			addToHistoryMutation.mutate(track.id);
		} else {
			if (audio) {
				if (!isPlaying) {
					playAudio(audio);
				} else {
					pauseAudio(audio);
				}
			}
		}
	}

	async function onClickPlaylist(track: Track, playlistId: number) {
		const queueId = useQueueStore.getState().queueId;
		const type = useQueueStore.getState().type;
		const trackInfo = useTrackStore.getState().trackInfo;

		if (!trackInfo || type !== 'playlist' || queueId !== playlistId) {
			if (isPlaying && audio) {
				audio.pause();
			}

			setNewAudio(track);
			setPlaylistQueue(playlistId, 1);

			addToHistoryMutation.mutate(track.id);
		} else {
			if (audio) {
				if (!isPlaying) {
					playAudio(audio);
				} else {
					pauseAudio(audio);
				}
			}
		}
	}

	async function onClickAlbumTrack(
		track: Track,
		albumId: number,
		position: number
	) {
		const trackInfo = useTrackStore.getState().trackInfo;

		if (
			!trackInfo ||
			trackInfo.id !== track.id ||
			type !== 'album' ||
			queueId !== albumId
		) {
			if (isPlaying && audio) {
				audio.pause();
			}

			setNewAudio(track);
			setAlbumQueue(albumId, position);

			addToHistoryMutation.mutate(track.id);
		} else {
			if (audio) {
				if (!isPlaying) {
					playAudio(audio);
				} else {
					pauseAudio(audio);
				}
			}
		}
	}

	async function onClickAlbum(track: Track, albumId: number) {
		const queueId = useQueueStore.getState().queueId;
		const type = useQueueStore.getState().type;
		const trackInfo = useTrackStore.getState().trackInfo;

		if (!trackInfo || type !== 'album' || queueId !== albumId) {
			if (isPlaying && audio) {
				audio.pause();
			}

			setNewAudio(track);
			setAlbumQueue(albumId, 1);

			addToHistoryMutation.mutate(track.id);
		} else {
			if (audio) {
				if (!isPlaying) {
					playAudio(audio);
				} else {
					pauseAudio(audio);
				}
			}
		}
	}

	return {
		isPlaying,
		trackId,
		queueId,
		type,
		audioReady,
		shuffle,
		repeat,
		onEnded,
		onClickUserTrack,
		onClickLikedTrack,
		onClickPlaylistTrack,
		onClickAlbumTrack,
		onClickUser,
		onClickPlaylist,
		onClickAlbum,
		onClickSkipBack,
		onClickPlay,
		onClickSkipForward,
		onClickShuffle,
		onClickRepeat
	};
}
