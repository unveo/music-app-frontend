import { Album } from '../album/album.types';
import { Track } from '../track/track.types';
import { UserPublic } from '../user/user.types';

export interface SearchResultUser {
	type: 'user';
	document: UserPublic;
}

export interface SearchResultAlbum {
	type: 'album';
	document: Album;
}

export interface SearchResultTrack {
	type: 'track';
	document: Track;
}
