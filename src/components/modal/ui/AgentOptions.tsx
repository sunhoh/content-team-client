import { BlogOptions } from '@/components/modal/ui/blog/BlogOptions';
import {
  LandingSectionInput,
  PosterOptions,
} from '@/components/modal/ui/poster/PosterOptions';
import { Persona, Platform } from '@/constants/agents/blog.constants';
import {
  ContentType,
  ImageType,
  PosterSizeType,
} from '@/constants/agents/poster.constants';

interface AgentOptionsProps {
  selectedId: string;
  persona: Persona;
  platform: Platform;
  onPersonaChange: (v: Persona) => void;
  onPlatformChange: (v: Platform) => void;
  imageType: ImageType;
  onImageTypeChange: (v: ImageType) => void;
  contentType: ContentType;
  onContentTypeChange: (v: ContentType) => void;
  posterSize: PosterSizeType;
  onPosterSizeChange: (v: PosterSizeType) => void;
  imageFiles: File[];
  onImagesChange: (v: File[]) => void;
  landingSections: LandingSectionInput[];
  onLandingSectionsChange: (sections: LandingSectionInput[]) => void;
}

export function AgentOptions({
  selectedId,
  persona,
  platform,
  onPersonaChange,
  onPlatformChange,
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
}: AgentOptionsProps) {
  const isBlog = selectedId === 'david';
  const isVisible = isBlog || selectedId === 'nova';

  return (
    <div className={!isVisible ? 'invisible pointer-events-none' : ''}>
      {selectedId === 'nova' ? (
        <PosterOptions
          imageType={imageType}
          onImageTypeChange={onImageTypeChange}
          contentType={contentType}
          onContentTypeChange={onContentTypeChange}
          posterSize={posterSize}
          onPosterSizeChange={onPosterSizeChange}
          imageFiles={imageFiles}
          onImagesChange={onImagesChange}
          landingSections={landingSections}
          onLandingSectionsChange={onLandingSectionsChange}
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
