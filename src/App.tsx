import { useState } from "react";
import "./App.css";
import LazyProgressiveImage from "./components/LazyProgressiveImage";

function generateArray(length: number) {
  return Array.from({ length }, (_, i) => i);
}

function App() {
  return (
    <div className='App'>
      <div className='container'>
        {[...Array(15).keys()].map((item) => {
          let index = item + 1;
          return (
            <LazyProgressiveImage
              key={index}
              imageSrc={`/heavy/${index}.jpeg`}
              placeholderSrc={`/superlight/${index}.jpeg`}
              width={400}
              height={600}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
