import { api } from '@/api/interceptors';
import type {
	SearchResultAlbum,
	SearchResultTrack,
	SearchResultUser
} from './search.types';

export const searchService = {
	async search(query: string) {
		return await api.get<
			Array<SearchResultUser | SearchResultAlbum | SearchResultTrack>
		>(`/search?search=${query}`);
	}
};
