import { BlogOptions } from '@/components/modal/ui/blog/BlogOptions';
import { PosterOptions } from '@/components/modal/ui/poster/PosterOptions';
import { Persona, Platform } from '@/constants/agents/blog.constants';
import { ContentType, ThumbnailType, PosterSizeType } from '@/constants/agents/poster.constants';

interface AgentOptionsProps {
  selectedId: string;
  persona: Persona;
  platform: Platform;
  onPersonaChange: (v: Persona) => void;
  onPlatformChange: (v: Platform) => void;
  contentType: ContentType;
  onContentTypeChange: (v: ContentType) => void;
  thumbnailType: ThumbnailType;
  onThumbnailTypeChange: (v: ThumbnailType) => void;
  posterSize: PosterSizeType;
  onPosterSizeChange: (v: PosterSizeType) => void;
  image: string;
  onImageChange: (v: string) => void;
}

export function AgentOptions({
  selectedId,
  persona,
  platform,
  onPersonaChange,
  onPlatformChange,
  contentType,
  onContentTypeChange,
  thumbnailType,
  onThumbnailTypeChange,
  posterSize,
  onPosterSizeChange,
  image,
  onImageChange,
}: AgentOptionsProps) {
  const isBlog = selectedId === 'david';
  const isVisible = isBlog || selectedId === 'nova';

  return (
    <div className={!isVisible ? 'invisible pointer-events-none' : ''}>
      {selectedId === 'nova' ? (
        <PosterOptions
          contentType={contentType}
          onContentTypeChange={onContentTypeChange}
          thumbnailType={thumbnailType}
          onThumbnailTypeChange={onThumbnailTypeChange}
          posterSize={posterSize}
          onPosterSizeChange={onPosterSizeChange}
          image={image}
          onImageChange={onImageChange}
        />
      ) : (
        <BlogOptions
          persona={persona}
          platform={platform}
          onPersonaChange={onPersonaChange}
          onPlatformChange={onPlatformChange}
        />
      )}
    </div>
  );
}
