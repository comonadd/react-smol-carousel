import React, { useState, useMemo, useEffect } from "react";
import ReactDOM from "react-dom";
import Slider, { SliderIndicator, useSliderController } from "../slider";
import "./examples.css";
import ControllableExample from "./ControllableExample";
import BasicExample from "./BasicExample";
import CustomUIExample from "./CustomUIExample";

const App = () => {
  return (
    <div className="app">
      <h1>Examples</h1>
      <BasicExample />
      <ControllableExample />
      <CustomUIExample />
    </div>
  );
};

const rootElem = document.getElementById("root");
ReactDOM.render(<App />, rootElem);
