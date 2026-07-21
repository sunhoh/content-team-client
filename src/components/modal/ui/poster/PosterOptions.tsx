'use client';

import { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import {
  CONTENT_TYPE_OPTIONS, ContentType,
  THUMBNAIL_TYPE_OPTIONS, ThumbnailType,
  POSTER_SIZE_OPTIONS, PosterSizeType,
} from '@/constants/agents/poster.constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

interface PosterOptionsProps {
  contentType: ContentType;
  onContentTypeChange: (value: ContentType) => void;
  thumbnailType: ThumbnailType;
  onThumbnailTypeChange: (value: ThumbnailType) => void;
  posterSize: PosterSizeType;
  onPosterSizeChange: (value: PosterSizeType) => void;
  image: string;
  onImageChange: (value: string) => void;
}

export function PosterOptions({
  contentType, onContentTypeChange,
  thumbnailType, onThumbnailTypeChange,
  posterSize, onPosterSizeChange,
  image, onImageChange,
}: PosterOptionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onImageChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      {/* 콘텐츠 유형 */}
      <div>
        <p className="mb-3 font-mono text-[10.5px] font-semibold tracking-widest text-ink-faint uppercase">
          콘텐츠 유형
        </p>
        <div className="flex gap-2">
          {(Object.entries(CONTENT_TYPE_OPTIONS) as [ContentType, string][]).map(([value, label]) => (
            <button
              key={value}
              onClick={() => onContentTypeChange(value)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                contentType === value
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
        <p className="mb-3 font-mono text-[10.5px] font-semibold tracking-widest text-ink-faint uppercase">
          {contentType === 'thumbnail' ? '채널 유형' : '포스터 사이즈'}
        </p>
        {contentType === 'thumbnail' ? (
          <Select value={thumbnailType} onValueChange={(v) => v && onThumbnailTypeChange(v as ThumbnailType)}>
            <SelectTrigger>
              <span className="text-sm text-ink">{THUMBNAIL_TYPE_OPTIONS[thumbnailType]}</span>
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(THUMBNAIL_TYPE_OPTIONS) as [ThumbnailType, string][]).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Select value={posterSize} onValueChange={(v) => v && onPosterSizeChange(v as PosterSizeType)}>
            <SelectTrigger>
              <span className="text-sm text-ink">{POSTER_SIZE_OPTIONS[posterSize]}</span>
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(POSTER_SIZE_OPTIONS) as [PosterSizeType, string][]).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* 참고 이미지 */}
      <div>
        <p className="mb-3 font-mono text-[10.5px] font-semibold tracking-widest text-ink-faint uppercase">
          참고 이미지 <span className="normal-case tracking-normal font-normal text-ink-faint">— 선택</span>
        </p>

        {image ? (
          <div className="relative w-full overflow-hidden rounded-2xl neu-inset">
            <img src={image} alt="preview" className="h-32 w-full object-cover" />
            <button
              onClick={() => { onImageChange(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink/60 text-base hover:bg-ink/80 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-2xl py-5 text-sm text-ink-faint transition-all neu-raised-sm hover:text-ink-dim"
          >
            <ImagePlus size={18} />
            <span className="text-xs">이미지 파일 선택</span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
