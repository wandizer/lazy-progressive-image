import { useState } from "react";
import "./App.css";
import LazyProgressiveImage, { Ratio } from "./components/LazyProgressiveImage";
import LazyProgressivePicture from "./components/LazyProgressivePicture";

function App() {
  const [showImage, setShowImage] = useState(false);
  const [showPicture, setShowPicture] = useState(true);

  const usingHeightAndWidthProps = { height: 720, width: 1280 };
  const usingRatioProps = { ratio: "16/9" as Ratio };

  // DEMO
  return (
    <div className='App'>
      <div className='header'>
        <button className='button' onClick={() => setShowImage(!showImage)}>
          <span className={`circle ${showImage ? "active" : "inactive"}`}></span>
          Toggle Image
        </button>
        <button className='button' onClick={() => setShowPicture(!showPicture)}>
          <span className={`circle ${showPicture ? "active" : "inactive"}`}></span>
          Toggle Picture
        </button>
      </div>
      <div className='container'>
        {showImage &&
          [...Array(7).keys()].map((item) => {
            let index = item + 1;
            return (
              <LazyProgressiveImage
                key={index}
                imageSrc={`/images/heavy/compressed/landscape${index}.png`}
                placeholderSrc={`/images/light/compressed/landscape${index}.png`}
                // {...usingHeightAndWidthProps} // Option 1: using height and width
                {...usingRatioProps} // Option 2: using ratio
                features={{
                  placeholderBlur: false, // default is false
                  diminishOnHidden: false, // default is false
                }}
              />
            );
          })}

        {showPicture &&
          [...Array(7).keys()].map((item) => {
            let index = item + 1;
            return (
              <LazyProgressivePicture
                key={index}
                imageSrc={`/images/heavy/compressed/landscape${index}.png`} // Fallback src for img
                placeholderSrc={`/images/light/compressed/landscape${index}.png`} // Fallback src for img
                sources={[
                  {
                    srcSet: `/images/heavy/compressed/portrait${index}.png, /images/heavy/compressed/portrait${index}@2x.png 2x`,
                    type: "image/png",
                    media: "(max-width: 768px)",
                  },
                  {
                    srcSet: `/images/heavy/compressed/landscape${index}.png, /images/heavy/compressed/landscape${index}@2x.png 2x`,
                    type: "image/png",
                    media: "(min-width: 769px)",
                  },
                ]}
                placeholderSources={[
                  {
                    srcSet: `/images/light/compressed/portrait${index}.png`,
                    type: "image/png",
                    media: "(max-width: 768px)",
                  },
                  {
                    srcSet: `/images/light/compressed/landscape${index}.png`,
                    type: "image/png",
                    media: "(min-width: 769px)",
                  },
                ]}
                // Option 1: using height and width
                // {...usingHeightAndWidthProps}
                // Option 2: using ratio <-- Disabled in order to manually change ration using CSS
                // {...usingRatioProps}
                features={{
                  placeholderBlur: false, // default is false
                  diminishOnHidden: false, // default is false
                }}
              />
            );
          })}
      </div>
    </div>
  );
}

export default App;
