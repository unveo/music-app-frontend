import api from '@/api/interceptors';

export const fileService = {
  async getAudio(filename: string) {
    return await api.get<any>(`/file/${filename}`);
  }
};

// todo
