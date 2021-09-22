import React, { useState, useMemo, useEffect } from "react";
import ReactDOM from "react-dom";
import Slider, { SliderIndicator, useSliderController } from "../slider";
import { Example, ExampleTitle, ExampleContent } from "./common";

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
      <ExampleTitle
        title="Controllable slider"
        subtitle="(use h/l to navigate)"
      />
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

export default ControllableExample;
