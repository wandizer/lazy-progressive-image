import { CSSProperties, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { ProgressiveImage } from "./components/ProgressiveImage";
import LazyProgressiveImage from "./components/LazyProgressiveImage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className='App'>
      <div className='container'>
        {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15"].map((item) => (
          // <div className='card' key={item}>
          //   <ProgressiveImage name={item} />
          // </div>
          <LazyProgressiveImage
            key={item}
            filename={`${item}.jpeg`}
            width={400 as React.CSSProperties}
            height={600 as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
