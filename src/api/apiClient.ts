import axiosInstance from '@/api/axios';
import { Persona, Platform } from '@/constants/agents/blog.constants';

export interface GeneratePostRequest {
  topic: string;
  tenant: string;
  persona?: Persona;
  platform?: Platform;
  language?: string;
}

// TODO: 배너 API 스펙 확정 후 타입 업데이트
export interface CreateBannerRequest {
  [key: string]: unknown;
}

export interface GeneratePosterRequest {
  topic: string;
  tenant: string;
  imageType?: string;
  contentType?: string; // thumbnail 전용: youtube | instagram | blog | meta
  posterSize?: string;  // poster 전용: vertical | horizontal | square | a4
  language?: string;
  image?: File;
}

export interface FigmaGenerateRequest {
  imageType: string;
  topic: string;
  tenant: string;
  spec: Record<string, unknown>;
  imagePrompt: string;
  imageUrl: string;
}

export const api = {
  verify: async (req: { apiKey: string }) => {
    const { data } = await axiosInstance.post(
      `/auth/verify`,
      {},
      {
        headers: { Authorization: `Bearer ${req.apiKey}` },
      },
    );
    return data;
  },

  generatePost: async (req: GeneratePostRequest) => {
    const { data } = await axiosInstance.post(`/post/generate`, req);
    return data;
  },

  createBanner: async (req: CreateBannerRequest) => {
    const { data } = await axiosInstance.post('/banner', req);
    return data;
  },

  figmaGenerate: async (req: FigmaGenerateRequest) => {
    const { data } = await axiosInstance.post('/poster/figma-generate', req);
    return data as { data: { figmaUrl: string } };
  },

  generatePoster: async (req: GeneratePosterRequest) => {
    const form = new FormData();
    form.append('topic', req.topic);
    form.append('tenant', req.tenant);
    if (req.imageType) form.append('imageType', req.imageType);
    if (req.contentType) form.append('contentType', req.contentType);
    if (req.posterSize) form.append('posterSize', req.posterSize);
    if (req.language) form.append('language', req.language);
    if (req.image) form.append('image', req.image);
    const { data } = await axiosInstance.post('/poster/generate', form);
    return data;
  },
};
