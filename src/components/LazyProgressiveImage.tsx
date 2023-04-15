import { CSSProperties, useCallback, useRef, useState } from "react";
import { useIntersectionObserver, useTimeout } from "usehooks-ts";
import useImageOnLoadEnhanced from "../hooks/useImageOnLoadEnhanced";

const SAFE_DELAY = 100; // in ms

export type Ratio = `${number}/${number}`; // e.g. 1/1, 16/9, 3/4, 4/3, 9/16

export type PictureSource = {
  srcSet: string;
  media?: string;
  type?: string;
};

type LazyProgressivePictureProps = {
  imageSrc: string;
  placeholderSrc?: string;
  sources?: PictureSource[];
  placeholderSources?: PictureSource[];
  title?: string;
  // Wrapper
  width?: number | string;
  height?: number | string;
  ratio?: Ratio;
  wrapperStyle?: CSSProperties;
  // Features
  features?: {
    disableDefaultCSS?: boolean;
    placeholderBlur?: boolean;
    diminishOnHidden?: boolean;
    transitionDuration?: number; // in ms
  };
};

/**
 * Lazy progressive image component with placeholder. It uses IntersectionObserver to determine
 * if the image is in the screen, and charges the placeholder image first, then the full size image.
 * Behind the scenes, it uses `useImageOnLoadEnhanced` custom hook, which is an adapted version of
 * `useImageOnLoad` hook from `usehooks-ts` library. It also uses `useTimeout` and `useIntersectionObserver`
 * hook from `usehooks-ts`.
 * @param imageSrc - Fallback src for img
 * @param placeholderSrc - Fallback src for img
 * @param sources - Picture sources
 * @param placeholderSources - Picture sources
 * @param title - Image title (alt)
 * @param width - Image width
 * @param height - Image height
 * @param ratio - Image ratio
 * @param wrapperStyle - Wrapper style
 * @param features - Features
 * @param features.disableDefaultCSS - Disable default CSS (default is false)
 * @param features.placeholderBlur - Blur placeholder image (default is false)
 * @param features.diminishOnHidden - Diminish full size image when not visible (default is false)
 * @param features.transitionDuration - Transition duration in ms (default is 500 [ms])
 * @returns Lazy progressive image component
 */
export default function LazyProgressiveImage({
  imageSrc,
  sources,
  placeholderSrc,
  placeholderSources,
  title,
  ratio,
  width,
  height,
  wrapperStyle,
  features = {},
}: LazyProgressivePictureProps) {
  const {
    disableDefaultCSS = false,
    placeholderBlur = false,
    diminishOnHidden = false,
    transitionDuration = 500, // in ms
  } = features;
  const hasPlaceholderLogic = !!placeholderSrc; // && !!placeholderSources && placeholderSources.length > 0;

  // Intersection observer to determine if the image is in the screen
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(wrapperRef, { freezeOnceVisible: !diminishOnHidden });
  const isVisible = !!entry?.isIntersecting;

  // Thumnail & full size image (or just full size image on the thumbnail place if no placeholder)
  const { isThumbnailLoaded, isFullSizeLoaded, handleThumbnailOnLoad, handleFullSizeOnLoad, css } =
    useImageOnLoadEnhanced({ blur: placeholderBlur, transitionDuration });

  // If both thumbnail and full size image are loaded, hide the thumbnail image when the full size image is loaded
  // and the effect of `diminishing the full size image when not visible` is disabled
  const [hidePlaceholderWithTimeout, setHidePlaceholderWithTimeout] = useState(false);
  useTimeout(
    () => {
      if (hasPlaceholderLogic && isFullSizeLoaded && !diminishOnHidden) {
        setHidePlaceholderWithTimeout(true);
      }
    },
    // wait transition duration before hiding the placeholder to avoid flash
    isFullSizeLoaded ? transitionDuration + SAFE_DELAY : null
  );

  const style: { [key: string]: CSSProperties } = {
    wrapper: !disableDefaultCSS
      ? {
          position: "relative",
          overflow: "hidden",
          width: width || "100%",
          ...(!ratio && height && { height }),
          ...(ratio && { aspectRatio: ratio }),
          ...wrapperStyle,
        }
      : {},
    image: !disableDefaultCSS
      ? {
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }
      : {},
  };

  const diminishEffectOnHidden = {
    // replace full size image with thumbnail when not visible effect
    opacity: isVisible && isFullSizeLoaded ? 1 : "0",
  };

  const renderImage = useCallback((imgComponent: JSX.Element, pictureSources?: PictureSource[]): JSX.Element => {
    if (pictureSources && pictureSources.length > 0) {
      return (
        <picture>
          {pictureSources?.map((source, index) => (
            <source key={index} {...source} />
          ))}
          {imgComponent}
        </picture>
      );
    }
    return imgComponent;
  }, []);

  return (
    <div className='wrapper' style={style.wrapper} ref={wrapperRef}>
      {(isVisible || isThumbnailLoaded) && (
        <>
          {/* Thumbnail image or full size image if placeholder not provided */}
          {!hidePlaceholderWithTimeout && // is safely removed from DOM after full image loaded and after transition duration
            renderImage(
              <img
                onLoad={handleThumbnailOnLoad}
                style={{
                  ...style.image,
                  ...css.thumbnail,
                  visibility: !isVisible && isThumbnailLoaded ? "visible" : "inherit",
                }}
                src={placeholderSrc || imageSrc} // If no placeholder, thumbnail becomes the full size image (fallback src)
                alt={title || "thumnailImage"}
                loading='lazy'
              />,
              placeholderSources || sources
            )}
          {/* Full size image in placeholder logic, none otherwise */}
          {isThumbnailLoaded &&
            hasPlaceholderLogic && // if no placeholder, full size image is already rendered in the thumbnail place
            renderImage(
              <img
                onLoad={handleFullSizeOnLoad}
                style={{
                  ...style.image,
                  ...css.fullSize,
                  ...(diminishOnHidden ? diminishEffectOnHidden : {}),
                }}
                src={imageSrc}
                alt={title || "fullSizeImage"}
                loading='lazy'
              />,
              sources
            )}
        </>
      )}
    </div>
  );
}
