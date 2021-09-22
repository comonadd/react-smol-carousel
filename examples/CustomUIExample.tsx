import React, { useState, useMemo, useEffect } from "react";
import ReactDOM from "react-dom";
import Slider, { SliderIndicator, useSliderController } from "../slider";
import {
  ExampleControls,
  Example,
  ExampleTitle,
  ExampleContent,
} from "./common";

const IMAGES = [
  "https://upload.wikimedia.org/wikipedia/commons/6/62/Panthera_tigris_sumatran_subspecies.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/1024px-Lion_waiting_in_Namibia.jpg",
];

const CustomUIExample = () => {
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
      <ExampleTitle title="Custom UI" />
      <ExampleContent>
        <Slider
          className="app-slider"
          indicator={SliderIndicator.Lines}
          infinite
          enableKeys={enableKeys}
          indicatorClickable={indicatorClickable}
          renderNextControl={({ isThereNextSlide, nextSlide }) => (
            <div className="custom-handle" onClick={nextSlide}>
              {">>>"}
            </div>
          )}
          renderPrevControl={({ isTherePrevSlide, prevSlide }) => (
            <div className="custom-handle" onClick={prevSlide}>
              {"<<<"}
            </div>
          )}
          renderIndicator={({ numSlides, currentSlide }) => {
            let ind = [];
            console.log(currentSlide);
            for (let i = 0; i < numSlides; ++i) {
              const color = i === currentSlide ? "black" : "white";
              ind.push(
                <span
                  style={{
                    color,
                    fontWeight: "bold",
                    fontSize: 34,
                    marginRight: 2,
                    marginLeft: 2,
                  }}
                  key={i}
                >
                  {i + 1}
                </span>
              );
            }
            return (
              <div
                style={{
                  bottom: 0,
                  position: "absolute",
                  padding: "8px 0",
                }}
              >
                {ind}
              </div>
            );
          }}
        >
          {renderedPics}
        </Slider>
      </ExampleContent>
    </Example>
  );
};

export default CustomUIExample;
