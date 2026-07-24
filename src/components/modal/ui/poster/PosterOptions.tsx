'use client';

import { ImagePlus, Plus, X } from 'lucide-react';
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

export interface LandingSectionInput {
  topic: string;
  imageFiles?: File[];
}

const MAX_SECTIONS = 6;
const MAX_IMAGES = 3;

// ─── SectionItem ─────────────────────────────────────────────────────────────

interface SectionItemProps {
  section: LandingSectionInput;
  index: number;
  canRemove: boolean;
  onChange: (index: number, next: LandingSectionInput) => void;
  onRemove: (index: number) => void;
}

function SectionItem({ section, index, canRemove, onChange, onRemove }: SectionItemProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!section.imageFiles?.length) {
      setPreviews([]);
      return;
    }
    const urls = section.imageFiles.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [section.imageFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const merged = [...(section.imageFiles ?? []), ...files].slice(0, MAX_IMAGES);
    onChange(index, { ...section, imageFiles: merged });
    e.target.value = '';
  };

  const removeFile = (fileIndex: number) => {
    onChange(index, {
      ...section,
      imageFiles: section.imageFiles?.filter((_, i) => i !== fileIndex),
    });
  };

  return (
    <div className='neu-raised-sm rounded-xl p-3'>
      {/* 번호 + textarea + 제거 버튼 */}
      <div className='flex gap-2'>
        <span className='text-ink-faint mt-0.5 w-4 shrink-0 text-center font-mono text-[10px]'>
          {index + 1}
        </span>
        <textarea
          value={section.topic}
          onChange={e => onChange(index, { ...section, topic: e.target.value })}
          placeholder={`섹션 ${index + 1} 프롬프트`}
          rows={2}
          className='text-ink placeholder:text-ink-faint min-w-0 flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none'
        />
        {canRemove && (
          <button
            onClick={() => onRemove(index)}
            className='text-ink-faint hover:text-ink mt-0.5 shrink-0 transition-colors'
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* 구분선 + 이미지 첨부 영역 */}
      <div className='bg-line-dim mx-1 mt-3 mb-2.5 h-px' />
      <div className='flex items-center gap-2 pl-6'>
        {previews.map((url, i) => (
          <div
            key={i}
            className='neu-inset relative h-12 w-12 shrink-0 overflow-hidden rounded-lg'
          >
            <img src={url} alt={`s${index}-img${i}`} className='h-full w-full object-cover' />
            <button
              onClick={() => removeFile(i)}
              className='bg-ink/60 hover:bg-ink/80 absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full transition-colors'
            >
              <X size={7} color='#ffffff' />
            </button>
          </div>
        ))}

        {(section.imageFiles?.length ?? 0) < MAX_IMAGES && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className='text-ink-faint hover:text-ink-dim flex h-12 w-12 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-current/20 transition-all'
          >
            <ImagePlus size={13} />
            <span className='text-[9px]'>추가</span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          multiple
          className='hidden'
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

// ─── PosterOptions ────────────────────────────────────────────────────────────

interface PosterOptionsProps {
  imageType: ImageType;
  onImageTypeChange: (value: ImageType) => void;
  contentType: ContentType;
  onContentTypeChange: (value: ContentType) => void;
  posterSize: PosterSizeType;
  onPosterSizeChange: (value: PosterSizeType) => void;
  imageFiles: File[];
  onImagesChange: (value: File[]) => void;
  landingSections: LandingSectionInput[];
  onLandingSectionsChange: (sections: LandingSectionInput[]) => void;
}

export function PosterOptions({
  imageType,
  onImageTypeChange,
  contentType,
  onContentTypeChange,
  posterSize,
  onPosterSizeChange,
  imageFiles,
  onImagesChange,
  landingSections,
  onLandingSectionsChange,
}: PosterOptionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (imageFiles.length === 0) {
      setPreviewUrls([]);
      return;
    }
    const urls = imageFiles.map(f => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [imageFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const merged = [...imageFiles, ...files].slice(0, MAX_IMAGES);
    onImagesChange(merged);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    onImagesChange(imageFiles.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, next: LandingSectionInput) => {
    onLandingSectionsChange(landingSections.map((s, i) => (i === index ? next : s)));
  };

  const addSection = () => {
    if (landingSections.length >= MAX_SECTIONS) return;
    onLandingSectionsChange([...landingSections, { topic: '' }]);
  };

  const removeSection = (index: number) => {
    if (landingSections.length <= 1) return;
    onLandingSectionsChange(landingSections.filter((_, i) => i !== index));
  };

  return (
    <div className='space-y-5'>
      {/* 이미지 유형 */}
      <div>
        <p className='text-ink-faint mb-3 font-mono text-[10.5px] font-semibold tracking-widest uppercase'>
          이미지 유형
        </p>
        <div className='flex gap-2'>
          {(Object.entries(IMAGE_TYPE_OPTIONS) as [ImageType, string][]).map(
            ([value, label]) => (
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
            ),
          )}
        </div>
      </div>

      {/* 채널 유형 / 포스터 사이즈 */}
      {imageType !== 'landing' && (
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
                  Object.entries(POSTER_SIZE_OPTIONS) as [PosterSizeType, string][]
                ).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* 랜딩 섹션 / 참고 이미지 */}
      {imageType === 'landing' ? (
        <div>
          <p className='text-ink-faint mb-3 font-mono text-[10.5px] font-semibold tracking-widest uppercase'>
            섹션
          </p>
          <div className='space-y-3'>
            {landingSections.map((section, i) => (
              <SectionItem
                key={i}
                section={section}
                index={i}
                canRemove={landingSections.length > 1}
                onChange={updateSection}
                onRemove={removeSection}
              />
            ))}

            {landingSections.length < MAX_SECTIONS && (
              <button
                onClick={addSection}
                className='text-ink-faint neu-raised-sm hover:text-ink-dim flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-medium transition-all'
              >
                <Plus size={11} />
                섹션 추가
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          <p className='text-ink-faint mb-3 font-mono text-[10.5px] font-semibold tracking-widest uppercase'>
            참고 이미지
            <span className='text-ink-faint font-normal tracking-normal normal-case'>
              — 선택
            </span>
          </p>

          <div className='flex gap-2'>
            {previewUrls.map((url, i) => (
              <div
                key={i}
                className='neu-inset relative h-20 w-20 shrink-0 overflow-hidden rounded-xl'
              >
                <img
                  src={url}
                  alt={`preview-${i}`}
                  className='h-full w-full object-cover'
                />
                <button
                  onClick={() => removeImage(i)}
                  className='bg-ink/60 hover:bg-ink/80 absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full transition-colors'
                >
                  <X size={8} color='#ffffff' />
                </button>
              </div>
            ))}

            {imageFiles.length < MAX_IMAGES && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className='text-ink-faint neu-raised-sm hover:text-ink-dim flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-xl transition-all'
              >
                <ImagePlus size={16} />
                <span className='text-[10px]'>추가</span>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            multiple
            className='hidden'
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
