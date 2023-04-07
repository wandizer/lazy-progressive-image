import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

type ProgressiveImageProps = {
  name: string;
};

export const ProgressiveImage = ({ name }: ProgressiveImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedStarted, setIsLoadedStarted] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleLoadStart = () => {
    console.log("🚀 ~ isLoadedStarted:", isLoadedStarted);
    setIsLoadedStarted(true);
  };

  return (
    <>
      <LazyLoadImage
        src={`/heavy/${name}.jpeg`}
        // width={180}
        // height={320}
        PlaceholderSrc={`/superlight/${name}.jpeg`}
        alt='Image Alt'
        // effect='blur'
        visibleByDefault={true}
        beforeLoad={handleLoadStart}
        afterLoad={handleLoad}
      />
      {/* <picture className={!isLoaded ? "loading" : ""}>
        <source media='(max-width: 768px)' srcSet={`/light/${name}.jpeg`} />
        <source media='(min-width: 1280px)' srcSet={`/heavy/${name}.jpeg`} />
        <img
          src={`/light/${name}.jpeg`}
          alt='progresive_image'
          loading='lazy'
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
        />
      </picture> */}
      {isLoadedStarted && !isLoaded && <img src={`/superlight/${name}.jpeg`} alt='progresive_image' />}
    </>
  );
};
