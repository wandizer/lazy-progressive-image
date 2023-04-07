import React, { useEffect, useRef, useState } from "react";
import { CSSProperties } from "react";
import { useImageOnLoad, useIntersectionObserver } from "usehooks-ts";

export type Ratio = "16/9" | "4/3" | "1/1" | "3/2";

type LazyImageProps = {
  filename: string;
  width?: CSSProperties;
  height?: CSSProperties;
  ratio?: Ratio;
  maxWidth?: CSSProperties;
};

export default function LazyProgressiveImage({ filename, ratio, maxWidth, width, height }: LazyImageProps) {
  const { handleImageOnLoad, css } = useImageOnLoad();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(wrapperRef, {
    freezeOnceVisible: false,
  });
  const isVisible = !!entry?.isIntersecting;
  const [isHalfLoaded, setIsHalfLoaded] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  useEffect(() => {
    if (isVisible) console.log(`🚀 ~ Render section ${filename}`, { isVisible });
  }, [isVisible]);

  const handleThumbnailImageOnLoad = () => {
    console.log("🚀 ~ handleThumbnailImageOnLoad");
    setIsHalfLoaded(true);
  };

  const handleFullSizeImageOnLoad = () => {
    console.log("🚀 ~ handleFullSizeImageOnLoad");
    handleImageOnLoad();
    setIsFullyLoaded(true);
  };

  const style = {
    wrap: {
      position: "relative",
      margin: "auto",
      width: width || 200,
      height: height || 300,
      border: "1px solid #ccc",
    },
    image: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: "100%",
      height: "100%",
    },
  };

  return (
    <div style={style.wrap} ref={wrapperRef}>
      {(isVisible || isHalfLoaded) && (
        <>
          <img
            onLoad={handleThumbnailImageOnLoad}
            style={{
              ...style.image,
              ...css.thumbnail,
              // visibility: isHalfLoaded ? "visible" : "inherit",
              filter: "none", // Remove default blur filter
              opacity: isHalfLoaded ? "1" : "0", // hide thumbnail until it's loaded
              transition: "opacity 0.5s ease-in 0s",
            }}
            src={`/superlight/${filename}`}
            alt='thumbnail'
            loading='lazy'
          />
          {isHalfLoaded && (
            <img
              onLoad={handleFullSizeImageOnLoad}
              style={{
                ...style.image,
                ...css.fullSize,
                opacity: isVisible && isFullyLoaded ? 1 : "0", // hide full image until it's visible
                transition: "opacity 0.5s ease-in 0s",
              }}
              src={`/heavy/${filename}`}
              alt='fullSize'
              loading='lazy'
            />
          )}
        </>
      )}
    </div>
  );
}
