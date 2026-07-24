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

export interface GenerateThumbnailRequest {
  topic: string;
  tenant: string;
  contentType: string;
  language?: string;
  image?: File;
}

export interface GeneratePosterRequest {
  topic: string;
  tenant: string;
  language?: string;
  image?: File;
}

export interface GenerateLandingSection {
  topic: string;
  imageFiles?: File[];
}

export interface GenerateLandingRequest {
  tenant: string;
  language?: string;
  sections: GenerateLandingSection[];
}

export interface GeneratePlannerRequest {
  topic: string;
  tenant: string;
  language?: string;
}

export type FigmaGenerateRequest =
  | {
      imageType: 'thumbnail' | 'poster';
      topic: string;
      tenant: string;
      spec: Record<string, unknown>;
      imagePrompt: string;
      imageUrl: string;
    }
  | {
      imageType: 'landing';
      topic: string;
      tenant: string;
      sections: Array<{ id: string; type: string; imageUrl?: string }>;
    };

export const api = {
  verify: async (req: { apiKey: string }) => {
    const { data } = await axiosInstance.post(
      `/auth/verify`,
      {},
      { headers: { Authorization: `Bearer ${req.apiKey}` } },
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

  generateThumbnail: async (req: GenerateThumbnailRequest) => {
    const form = new FormData();
    form.append('topic', req.topic);
    form.append('tenant', req.tenant);
    form.append('contentType', req.contentType);
    if (req.language) form.append('language', req.language);
    if (req.image) form.append('image', req.image);
    const { data } = await axiosInstance.post(
      '/poster/thumbnail-generate',
      form,
    );
    return data;
  },

  generatePoster: async (req: GeneratePosterRequest) => {
    const form = new FormData();
    form.append('topic', req.topic);
    form.append('tenant', req.tenant);
    if (req.language) form.append('language', req.language);
    if (req.image) form.append('image', req.image);
    const { data } = await axiosInstance.post('/poster/poster-generate', form);
    return data;
  },

  generateLanding: async (req: GenerateLandingRequest) => {
    const form = new FormData();
    form.append('tenant', req.tenant);
    if (req.language) form.append('language', req.language);
    req.sections.forEach((section, i) => {
      form.append(`sections[${i}][topic]`, section.topic);
      section.imageFiles?.forEach(file =>
        form.append(`sections[${i}][images]`, file),
      );
    });
    const { data } = await axiosInstance.post('/poster/landing-generate', form);
    return data;
  },

  generatePlanner: async (req: GeneratePlannerRequest) => {
    const { data } = await axiosInstance.post('/planner/generate', req);
    return data;
  },

  figmaGenerate: async (req: FigmaGenerateRequest) => {
    const { data } = await axiosInstance.post('/poster/figma-generate', req);
    return data as { data: { figmaUrl: string } };
  },
};
