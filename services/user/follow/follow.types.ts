import type { UserWithoutFollowingCount } from '../user.types';

export interface Follower {
	follower: UserWithoutFollowingCount;
}

export interface Following {
	following: UserWithoutFollowingCount;
}
