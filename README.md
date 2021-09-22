# react-smol-carousel

Lightweight React.js carousel implementation with react hooks support.

## Usage

```js
import React from "react";
import ReactDOM from "react-dom";
import Slider, { SliderIndicator, useSliderController } from "../slider";

const App = () => {
  const slider = useSliderController({ infinite: true });
  React.useEffect(() => {
    console.log(`Current slide: ${slider.currentSlide}`);
  }, [slider.currentSlide]);
  React.useEffect(() => {
    const el = (e) => {
      switch (e.keyCode) {
        case 37:
          {
            // left
            slider.prevSlide();
          }
          break;
        case 39:
          {
            // right
            slider.nextSlide();
          }
          break;
      }
    };
    document.addEventListener("keydown", el);
    return () => {
      document.removeEventListener("keydown", el);
    };
  }, [slider]);
  return (
    <div className="app">
      <Slider
        className="app-slider"
        indicator={SliderIndicator.Dots}
        controller={slider}
      >
        <div>Hello</div>
        <div>This is me</div>
        <div>How are you</div>
        <div>Bye</div>
      </Slider>
    </div>
  );
};
```

## Examples

View examples in the `/examples` folder. To run them,

1. First build

```bash
$ npm run-script build-examples
```

2. Then open examples/index.html to interact with the examples library
