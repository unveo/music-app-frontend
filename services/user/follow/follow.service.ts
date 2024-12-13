import api from '@/api/interceptors';
import type { Follower, Following } from './follow.types';

export const followService = {
	async getManyFollowers(userId: number, take?: number) {
		return await api.get<Follower[]>(
			`user/${userId}/followers?take=${take && take}`
		);
	},

	async getManyFollowing(userId: number, take?: number) {
		return await api.get<Following[]>(
			`user/${userId}/following?take=${take && take}`
		);
	},

	async check(userToCheckId: number) {
		return await api.get<boolean>(`user/${userToCheckId}/check-follow`);
	},

	async follow(userToFollowId: number) {
		return await api.post<void>(`user/${userToFollowId}/follow`);
	},

	async unfollow(userToUnfollowId: number) {
		return await api.delete<void>(`user/${userToUnfollowId}/unfollow`);
	}
};
