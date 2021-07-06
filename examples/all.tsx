import React from "react";
import ReactDOM from "react-dom";
import Slider, { SliderIndicator, useSliderController } from "../slider";
import "./examples.css";

const Example = (props: { title: string; children: React.Children }) => {
  const { title, children } = props;
  return (
    <div className="rslider-example">
      <div className="rslider-example__title">
        <h2>{title}</h2>
      </div>
      <div className="rslider-example__content">{children}</div>
    </div>
  );
};

const BasicExample = () => {
  const renderedPics = React.useMemo(() => {
    const numPics = Math.round(Math.random() * 10);
    const resultingPics = [];
    for (let i = 0; i < numPics; ++i) {
      const backgroundColor = [Math.random() * 255, Math.random() * 255, Math.random() * 255];
      resultingPics.push(
        <div
          key={i}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: `rgb(${backgroundColor.join(",")})`,
          }}
        ></div>,
      );
    }
    return resultingPics;
  }, []);
  return (
    <Example title="Basic slider">
      <Slider className="app-slider" indicator={SliderIndicator.Lines} infinite>
        {renderedPics}
      </Slider>
    </Example>
  );
};

const ControllableExample = () => {
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
    <Example title="Controllable slider">
      <Slider className="app-slider" indicator={SliderIndicator.Dots} controller={slider}>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
      </Slider>
    </Example>
  );
};

const App = () => {
  return (
    <div className="app">
      <BasicExample />
      <ControllableExample />
    </div>
  );
};

const rootElem = document.getElementById("root");
ReactDOM.render(<App />, rootElem);
