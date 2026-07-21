import axiosInstance from '@/api/axios'
import { Persona, Platform } from '@/constants/agents/blog.constants'
import { ContentType } from '@/constants/agents/poster.constants'

interface GeneratePostRequest {
  topic: string;
  tenant: string;
  persona?: Persona;
  platform?: Platform;
  language?: string;
}

interface GeneratePosterRequest {
  contentType?: ContentType;
  topic: string;
  tenant: string;
  imageType?: string;
  language?: string;
  image?: string;
}

export const api = {
  verify: async (req: { apiKey: string }) => {
    const { data } = await axiosInstance.post(`/auth/verify`, {}, {
      headers: { Authorization: `Bearer ${req.apiKey}` },
    });
    return data;
  },

  generatePost: async (req: GeneratePostRequest) => {
    const { data } = await axiosInstance.post(`/post/generate`, req);
    return data;
  },

  generatePoster: async (req: GeneratePosterRequest) => {
    const payload = {
      ...req,
      image: req.image?.replace(/^data:image\/[^;]+;base64,/, '') || undefined,
    };
    const { data } = await axiosInstance.post('/poster/generate', payload);
    return data;
  },
}
