import React, { useState, useMemo, useEffect } from "react";
import ReactDOM from "react-dom";
import Slider, { SliderIndicator, useSliderController } from "../slider";
import "./examples.css";

const ExampleTitle = (props: { title: string }) => {
  return (
    <div className="rslider-example__title">
      <h2>{props.title}</h2>
    </div>
  );
};

const ExampleContent = (props: { children: any }) => {
  return <div className="rslider-example__content">{props.children}</div>;
};

const Example = (props: { children: any }) => {
  return <div className="rslider-example">{props.children}</div>;
};

const ExampleControls = (props: { children: any }) => {
  return <div className="rslider-example__controls">{props.children}</div>;
};

const IMAGES = [
  "https://upload.wikimedia.org/wikipedia/commons/6/62/Panthera_tigris_sumatran_subspecies.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/1024px-Lion_waiting_in_Namibia.jpg",
];

const BasicExample = () => {
  const renderedPics = useMemo(() => {
    const numPics = IMAGES.length;
    const resultingPics = [];
    for (let i = 0; i < numPics; ++i) {
      resultingPics.push(
        <img
          key={i}
          src={IMAGES[i]}
          style={{ width: "auto", height: "100%" }}
        />
      );
    }
    return resultingPics;
  }, []);
  const [enableKeys, setEnableKeys] = useState(true);
  const [indicatorClickable, setIndicatorClickable] = useState(false);
  return (
    <Example>
      <ExampleTitle title="Basic slider" />
      <ExampleControls>
        <div className="example-control">
          <input
            type="checkbox"
            checked={enableKeys}
            onChange={(e) => setEnableKeys(e.target.checked)}
          />
          <label>Enable keys</label>
        </div>
        <div className="example-control">
          <input
            type="checkbox"
            checked={indicatorClickable}
            onChange={(e) => setIndicatorClickable(e.target.checked)}
          />
          <label>Indicator clickable</label>
        </div>
      </ExampleControls>
      <ExampleContent>
        <Slider
          className="app-slider"
          indicator={SliderIndicator.Lines}
          infinite
          enableKeys={enableKeys}
          indicatorClickable={indicatorClickable}
        >
          {renderedPics}
        </Slider>
      </ExampleContent>
    </Example>
  );
};

const ControllableExample = () => {
  const slider = useSliderController({ infinite: false });
  useEffect(() => {
    console.log(`Current slide: ${slider.currentSlide}`);
  }, [slider.currentSlide]);
  useEffect(() => {
    const el = (e: any) => {
      switch (e.key) {
        case "h":
          {
            // left
            slider.prevSlide();
          }
          break;
        case "l":
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
    <Example>
      <ExampleTitle title="Controllable slider" />
      <ExampleContent>
        <Slider
          className="app-slider"
          indicator={SliderIndicator.Dots}
          controller={slider}
        >
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
        </Slider>
      </ExampleContent>
    </Example>
  );
};

const App = () => {
  return (
    <div className="app">
      <h1>Examples</h1>
      <BasicExample />
      <ControllableExample />
    </div>
  );
};

const rootElem = document.getElementById("root");
ReactDOM.render(<App />, rootElem);
