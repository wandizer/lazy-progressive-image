import { useState } from "react";
import "./App.css";
import LazyProgressiveImage from "./components/LazyProgressiveImage";

function App() {
  // DEMO
  return (
    <div className='App'>
      <div className='container'>
        {[...Array(7).keys()].map((item) => {
          let index = item + 1;
          const usingHeightAndWidthProps = {
            height: 720,
            width: 1280,
          };
          const usingRatioProps = {
            ratio: "16/9" as `${number}/${number}`,
          };
          return (
            <LazyProgressiveImage
              key={index}
              imageSrc={`/images/heavy/compressed/landscape${index}.png`}
              placeholderSrc={`/images/light/compressed/landscape${index}.png`}
              // {...usingHeightAndWidthProps} // Option 1: using height and width
              {...usingRatioProps} // Option 2: using ratio
              features={{
                placeholderBlur: false, // default is false
                diminishOnHidden: true, // default is true
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
