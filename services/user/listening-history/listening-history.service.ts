import { api } from '@/api/interceptors';
import type {
	ListeningHistoryRelation,
	ListeningHistoryTrack
} from './listening-history.types';

export const listeningHistoryService = {
	async get(take?: number) {
		return await api.get<ListeningHistoryTrack[]>(
			`/user/listening-history?take=${take ? take : ''}`
		);
	},

	async add(trackId: number) {
		return await api.post<ListeningHistoryRelation>(
			`/user/listening-history/${trackId}`
		);
	},

	async clear() {
		return await api.delete<void>('/user/listening-history');
	}
};
