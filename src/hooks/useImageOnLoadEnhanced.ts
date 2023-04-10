import { CSSProperties, useState } from "react";

type ImageStyle = {
  thumbnail: CSSProperties;
  fullSize: CSSProperties;
};

type EnhancedImageOnLoadType = {
  isThumbnailLoaded: boolean;
  isFullSizeLoaded: boolean;
  handleThumbnailOnLoad: () => void;
  handleFullSizeOnLoad: () => void;
  css: ImageStyle;
};

type PropsType = {
  blur?: boolean;
  blurRadius?: number;
  thumbnailCSS?: CSSProperties;
  fullSizeCSS?: CSSProperties;
};

/**
 * This hook is used to enhance the image loading experience.
 * It will blur the thumbnail image and show the full size image when it is loaded.
 * @param options.blur - Enable blur effect on the thumbnail image
 * @param options.blurRadius - The radius of the blur effect
 * @param options.thumbnailCSS - The extra CSS style of the thumbnail image
 * @param options.fullSizeCSS - The extra CSS style of the full size image
 */
function useImageOnLoadEnhanced(options?: PropsType): EnhancedImageOnLoadType {
  const { blur = false, blurRadius = 10, thumbnailCSS, fullSizeCSS } = options || {};
  const [isThumbnailLoaded, setIsThumbnailLoaded] = useState(false);
  const [isFullSizeLoaded, setIsFullSizeLoaded] = useState(false);

  const handleThumbnailOnLoad = () => setIsThumbnailLoaded(true);
  const handleFullSizeOnLoad = () => setIsFullSizeLoaded(true);

  const css: ImageStyle = {
    // Thumbnail image style
    thumbnail: {
      visibility: isFullSizeLoaded ? "visible" : "hidden",
      opacity: isThumbnailLoaded ? "1" : "0",
      transition: "opacity 0.5s ease-in-out, visibility 0s ease-out 0.5s",
      filter: blur ? `blur(${blurRadius}px)` : "none",
      ...thumbnailCSS,
    },
    // Full size image style
    fullSize: {
      opacity: isFullSizeLoaded ? 1 : "0",
      transition: "opacity 0.5s ease-in 0s",
      ...fullSizeCSS,
    },
  };

  return {
    isThumbnailLoaded,
    isFullSizeLoaded,
    handleThumbnailOnLoad,
    handleFullSizeOnLoad,
    css,
  };
}

export default useImageOnLoadEnhanced;
