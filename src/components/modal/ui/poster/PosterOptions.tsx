'use client';

import { ImagePlus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import {
  CONTENT_TYPE_OPTIONS,
  ContentType,
  IMAGE_TYPE_OPTIONS,
  ImageType,
  POSTER_SIZE_OPTIONS,
  PosterSizeType,
} from '@/constants/agents/poster.constants';

interface PosterOptionsProps {
  imageType: ImageType;
  onImageTypeChange: (value: ImageType) => void;
  contentType: ContentType;
  onContentTypeChange: (value: ContentType) => void;
  posterSize: PosterSizeType;
  onPosterSizeChange: (value: PosterSizeType) => void;
  imageFile: File | null;
  onImageChange: (value: File | null) => void;
}

export function PosterOptions({
  imageType,
  onImageTypeChange,
  contentType,
  onContentTypeChange,
  posterSize,
  onPosterSizeChange,
  imageFile,
  onImageChange,
}: PosterOptionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onImageChange(file);
  };

  return (
    <div className='space-y-5'>
      {/* 이미지 유형 */}
      <div>
        <p className='text-ink-faint mb-3 font-mono text-[10.5px] font-semibold tracking-widest uppercase'>
          이미지 유형
        </p>
        <div className='flex gap-2'>
          {(
            Object.entries(IMAGE_TYPE_OPTIONS) as [ImageType, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => onImageTypeChange(value)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                imageType === value
                  ? 'neu-inset text-nova'
                  : 'neu-raised-sm text-ink-dim hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 채널 유형 / 포스터 사이즈 */}
      <div>
        <p className='text-ink-faint mb-3 font-mono text-[10.5px] font-semibold tracking-widest uppercase'>
          {imageType === 'thumbnail' ? '채널 유형' : '포스터 사이즈'}
        </p>
        {imageType === 'thumbnail' ? (
          <Select
            value={contentType}
            onValueChange={v => v && onContentTypeChange(v as ContentType)}
          >
            <SelectTrigger>
              <span className='text-ink text-sm'>
                {CONTENT_TYPE_OPTIONS[contentType]}
              </span>
            </SelectTrigger>
            <SelectContent>
              {(
                Object.entries(CONTENT_TYPE_OPTIONS) as [ContentType, string][]
              ).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Select
            value={posterSize}
            onValueChange={v => v && onPosterSizeChange(v as PosterSizeType)}
          >
            <SelectTrigger>
              <span className='text-ink text-sm'>
                {POSTER_SIZE_OPTIONS[posterSize]}
              </span>
            </SelectTrigger>
            <SelectContent>
              {(
                Object.entries(POSTER_SIZE_OPTIONS) as [
                  PosterSizeType,
                  string,
                ][]
              ).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* 참고 이미지 */}
      <div>
        <p className='text-ink-faint mb-3 font-mono text-[10.5px] font-semibold tracking-widest uppercase'>
          참고 이미지{' '}
          <span className='text-ink-faint font-normal tracking-normal normal-case'>
            — 선택
          </span>
        </p>

        {previewUrl ? (
          <div className='neu-inset relative w-full overflow-hidden rounded-2xl'>
            <img
              src={previewUrl}
              alt='preview'
              className='h-32 w-full object-cover'
            />
            <button
              onClick={() => {
                onImageChange(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className='bg-ink/60 hover:bg-ink/80 absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full text-base transition-colors'
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className='text-ink-faint neu-raised-sm hover:text-ink-dim flex w-full flex-col items-center gap-2 rounded-2xl py-5 text-sm transition-all'
          >
            <ImagePlus size={18} />
            <span className='text-xs'>이미지 파일 선택</span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
