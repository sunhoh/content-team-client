export const CONTENT_TYPE_OPTIONS = {
  // youtube:   '유튜브',
  // instagram: '인스타그램',
  blog: '블로그',
  meta: '메타 광고',
} as const;

export type ContentType = keyof typeof CONTENT_TYPE_OPTIONS;
export const DEFAULT_CONTENT_TYPE: ContentType = 'meta';

export const POSTER_SIZE_OPTIONS = {
  vertical: '세로형',
  horizontal: '가로형',
  square: '정방형',
  a4: 'A4',
} as const;

export type PosterSizeType = keyof typeof POSTER_SIZE_OPTIONS;
export const DEFAULT_POSTER_SIZE: PosterSizeType = 'vertical';

export const IMAGE_TYPE_OPTIONS = {
  thumbnail: '썸네일',
  poster: '포스터',
} as const;

export type ImageType = keyof typeof IMAGE_TYPE_OPTIONS;
export const DEFAULT_IMAGE_TYPE: ImageType = 'thumbnail';
