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
  transitionDuration?: number; // 500 (ms)
};

/**
 * This hook is used to enhance the image loading experience.
 * It will blur the thumbnail image and show the full size image when it is loaded.
 * @param options.blur - Enable blur effect on the thumbnail image
 * @param options.blurRadius - The radius of the blur effect
 * @param options.thumbnailCSS - The extra CSS style of the thumbnail image
 * @param options.fullSizeCSS - The extra CSS style of the full size image
 * @param options.transitionDuration - The duration of the transitions
 * @returns {Object} The object of the hook:
 *    - isThumbnailLoaded - The state of the thumbnail image loading
 *    - isFullSizeLoaded - The state of the full size image loading
 *    - handleThumbnailOnLoad - The function to handle the thumbnail image loading
 *    - handleFullSizeOnLoad - The function to handle the full size image loading
 *    - css - The CSS style of the thumbnail and full size image
 */
function useImageOnLoadEnhanced(options?: PropsType): EnhancedImageOnLoadType {
  const { blur = false, blurRadius = 4, thumbnailCSS, fullSizeCSS, transitionDuration = 500 } = options || {};
  const [isThumbnailLoaded, setIsThumbnailLoaded] = useState(false);
  const [isFullSizeLoaded, setIsFullSizeLoaded] = useState(false);

  const handleThumbnailOnLoad = () => setIsThumbnailLoaded(true);
  const handleFullSizeOnLoad = () => setIsFullSizeLoaded(true);

  const css: ImageStyle = {
    // Thumbnail image style
    thumbnail: {
      visibility: isFullSizeLoaded ? "visible" : "hidden",
      opacity: isThumbnailLoaded ? "1" : "0",
      transition: `opacity ${transitionDuration}ms ease-in-out, visibility 0ms ease-out ${transitionDuration}ms`,
      filter: blur ? `blur(${blurRadius}px)` : "none",
      ...thumbnailCSS,
    },
    // Full size image style
    fullSize: {
      opacity: isFullSizeLoaded ? 1 : "0",
      transition: `opacity ${transitionDuration}ms ease-in 0ms`,
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
