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

const ExampleContent = (props: { children: React.Children }) => {
  return <div className="rslider-example__content">{props.children}</div>;
};

const Example = (props: { children: React.Children }) => {
  return <div className="rslider-example">{props.children}</div>;
};

const ExampleControls = (props: { children: React.Children }) => {
  return <div className="rslider-example__controls">{props.children}</div>;
};

const BasicExample = () => {
  const renderedPics = useMemo(() => {
    const numPics = Math.round(5);
    const resultingPics = [];
    for (let i = 0; i < numPics; ++i) {
      const backgroundColor = [
        Math.random() * 255,
        Math.random() * 255,
        Math.random() * 255,
      ];
      resultingPics.push(
        <div
          key={i}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: `rgb(${backgroundColor.join(",")})`,
          }}
        ></div>
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
