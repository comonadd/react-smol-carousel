import React from "react";
import ReactDOM from "react-dom";
import Slider, { SliderIndicator, useSliderController } from "../slider";
import "./examples.css";

const Example = (props: { title: string; children: React.Children }) => {
  const { title, children } = props;
  return (
    <div className="rslider-example">
      <div className="rslider-example__title"><h2>{title}</h2></div>
      <div className="rslider-example__content">{children}</div>
    </div>
  );
};

const BasicExample = () => {
  return (
    <Example title="Basic slider">
      <Slider className="app-slider" indicator={SliderIndicator.Lines} infinite>
        <div>Hello</div>
        <div>This is me</div>
        <div>How are you</div>
        <div>Bye</div>
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
        <div>Hello</div>
        <div>This is me</div>
        <div>How are you</div>
        <div>Bye</div>
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
