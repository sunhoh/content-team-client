export const PERSONA_OPTIONS = {
  review: '후기형',
  educational: '교육형',
  comparison: '비교형',
  essay: '에세이형',
  card: '카드형',
} as const;

export const PLATFORM_OPTIONS = {
  naver: 'Naver',
  google: 'Google',
} as const;

export type Persona = keyof typeof PERSONA_OPTIONS;
export type Platform = keyof typeof PLATFORM_OPTIONS;

export const DEFAULT_PERSONA: Persona = 'educational';
export const DEFAULT_PLATFORM: Platform = 'naver';
