import { CSSProperties, useRef, useState } from "react";
import { useIntersectionObserver, useTimeout } from "usehooks-ts";
import useImageOnLoadEnhanced from "../hooks/useImageOnLoadEnhanced";

const SAFE_DELAY = 100; // in ms

export type Ratio = `${number}/${number}`; // e.g. 1/1, 16/9, 3/4, 4/3, 9/16

type LazyProgressiveImageProps = {
  imageSrc: string;
  placeholderSrc?: string;
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

export default function LazyProgressiveImage({
  imageSrc,
  placeholderSrc,
  title,
  ratio,
  width,
  height,
  wrapperStyle,
  features = {},
}: LazyProgressiveImageProps) {
  const {
    disableDefaultCSS = false,
    placeholderBlur = false,
    diminishOnHidden = false,
    transitionDuration = 500, // in ms
  } = features;
  const hasPlaceholderLogic = !!placeholderSrc;

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

  return (
    <div className='wrapper' style={style.wrapper} ref={wrapperRef}>
      {(isVisible || isThumbnailLoaded) && (
        <>
          {/* Thumbnail image or full size image if placeholder not provided */}
          {!hidePlaceholderWithTimeout && ( // is safely removed from DOM after full image loaded and after transition duration
            <img
              onLoad={handleThumbnailOnLoad}
              style={{
                ...style.image,
                ...css.thumbnail,
                visibility: !isVisible && isThumbnailLoaded ? "visible" : "inherit",
              }}
              src={placeholderSrc || imageSrc} // If no placeholder, thumbnail becomes the full size image
              alt={title || "thumnailImage"}
              loading='lazy'
            />
          )}
          {/* Full size image in placeholder logic, none otherwise */}
          {isThumbnailLoaded && hasPlaceholderLogic && (
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
            />
          )}
        </>
      )}
    </div>
  );
}
