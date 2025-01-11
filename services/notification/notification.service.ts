import { api } from '@/api/interceptors';
import type { Notification } from './notification.types';

export const notificationService = {
	async getAll() {
		return await api.get<Notification[]>('notification');
	},

	async delete(notificationId: number) {
		return await api.delete<void>(`notification/one/${notificationId}`);
	},

	async deleteAll() {
		return await api.delete<void>('notification/all');
	}
};
