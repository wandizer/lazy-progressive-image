import { CSSProperties, useRef } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import useImageOnLoadEnhanced from "../hooks/useImageOnLoadEnhanced";

export type Ratio = `${number}/${number}`; // e.g. 1/1, 16/9, 3/4, 4/3, 9/16

export type PictureSource = {
  srcSet: string;
  media?: string;
  type?: string;
};

type LazyProgressivePictureProps = {
  imageSrc: string;
  placeholderSrc?: string;
  sources: PictureSource[];
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
  };
};

export default function LazyProgressivePicture({
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
  const { disableDefaultCSS = false, placeholderBlur = false, diminishOnHidden = true } = features;
  const hasPlaceholderLogic = !!placeholderSrc && !!placeholderSources && placeholderSources.length > 0;

  // Intersection observer to determine if the image is in the screen
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(wrapperRef, { freezeOnceVisible: false });
  const isVisible = !!entry?.isIntersecting;

  // Thumnail & full size image (or just full size image on the thumbnail place if no placeholder)
  const { isThumbnailLoaded, isFullSizeLoaded, handleThumbnailOnLoad, handleFullSizeOnLoad, css } =
    useImageOnLoadEnhanced({ blur: placeholderBlur });

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
          <picture>
            {(placeholderSources || sources).map((source, index) => (
              <source key={index} {...source} />
            ))}
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
            />
          </picture>
          {/* Full size image in placeholder logic, none otherwise */}
          {isThumbnailLoaded && hasPlaceholderLogic && (
            <picture>
              {sources.map((source, index) => (
                <source key={index} {...source} />
              ))}
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
            </picture>
          )}
        </>
      )}
    </div>
  );
}
