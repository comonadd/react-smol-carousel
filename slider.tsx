import React, { useLayoutEffect, useRef, useCallback, useMemo, useState, useEffect } from "react";
import "./slider.css";

type CNArg = string[] | Record<string, boolean>;
const cn = (...cns: CNArg[]): string => {
  let res = "";
  for (let i = 0; i < cns.length; ++i) {
    const cn = cns[i];
    if (cn instanceof Array) {
      if (i !== 0) res += " ";
      res += cn.join(" ");
    } else if (cn instanceof Object) {
      let currIdx = i;
      for (const key in cn) {
        if (cn[key]) {
          if (currIdx !== 0) res += " ";
          res += key;
          ++currIdx;
        }
      }
    }
  }
  return res;
};

type SCRR = React.Ref<HTMLDivElement>;
interface SliderController {
  nextSlide: () => void;
  prevSlide: () => void;
  currentSlide: number;
  __setMetaInfo: (rr: SCRR) => void;
}

interface SliderControllerOptions {
  // Whether the slider wraps around
  infinite?: boolean;
  startingSlide?: number;
}

interface SliderControllerMetaInfo {
  numSlides: number;
}

let __globalCRId = 0;
export const useSliderController = (options: SliderControllerOptions = {}): SliderController => {
  const infinite = options.infinite ?? false;
  const __controllerId = useMemo(() => {
    const res = __globalCRId;
    ++__globalCRId;
    return res;
  }, []);
  const startingSlide = options.startingSlide ?? 0;
  const [currentSlide, setCurrentSlide] = useState<number>(startingSlide);
  const [metaInfo, setMetaInfo] = useState<SliderControllerMetaInfo | null>(null);
  const prevSlide = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      console.assert(metaInfo !== null, "No meta info set");
    }
    const { numSlides } = metaInfo;
    if (currentSlide === 0) {
      if (infinite) {
        setCurrentSlide(numSlides - 1);
      }
    } else {
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide, metaInfo]);
  const nextSlide = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      console.assert(metaInfo !== null, "No meta info set");
    }
    const { numSlides } = metaInfo;
    if (currentSlide === numSlides - 1) {
      if (infinite) {
        setCurrentSlide(0);
      }
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  }, [currentSlide, metaInfo]);
  const __setMetaInfo = useCallback(setMetaInfo);
  return { currentSlide, nextSlide, prevSlide, __setMetaInfo, __controllerId };
};

export enum SliderIndicator {
  Dots,
  Lines,
}

export interface SliderProps extends SliderControllerOptions {
  indicator?: SliderIndicator;
  children: React.Children;
  className?: string;
  controller?: Controller;
  classes?: {
    container?: string;
  };
  __setMetaInfo: any;
}

const styles: any = {};

const itcn = {
  [SliderIndicator.Lines]: "rslider__line-indicator",
  [SliderIndicator.Dots]: "rslider__dots-indicator",
};

const Slider = (props: SliderProps) => {
  const { indicator, children, infinite } = props;
  const { __controllerId, __setMetaInfo, nextSlide, prevSlide, currentSlide } =
    props.controller ?? useSliderController(props);
  const classes = props.classes ?? {};
  const numSlides = children.length;
  const moveLeft = () => {
    prevSlide();
  };
  const moveRight = () => {
    nextSlide();
  };
  const slidesRef = useRef([]);
  const renderedSlides = useMemo(() => {
    return children.map((slide, idx) => {
      const active = idx === currentSlide;
      slidesRef.current[idx] = React.createRef(null);
      return (
        <div
          key={idx}
          className={cn(["rslider-slide", classes.slide], { "rslider-slide_active": active })}
          ref={slidesRef.current[idx]}
        >
          {slide}
        </div>
      );
    });
  }, [children, currentSlide]);
  const sliderContainerRef = useRef(null);

  useLayoutEffect(() => {
    if (slidesRef.current.length === 0) return;
    const elem = slidesRef.current[currentSlide].current;
    sliderContainerRef.current.scrollLeft = elem.offsetLeft;
  }, [renderedSlides]);

  const renderedIndicator = useMemo(() => {
    if (indicator === undefined) return null;
    const containerCn = itcn[indicator];
    if (process.env.NODE_ENV === "development") {
      if (!containerCn) {
        console.assert(
          false,
          "Invalid indicator type passed in, please use the exported enum SliderIndicator",
        );
      }
    }
    const icn = containerCn + "-item";
    let renderedLines = [];
    const icnActive = icn + "_active";
    for (let i = 0; i < numSlides; ++i) {
      renderedLines.push(
        <div
          key={i}
          className={cn({
            [icn]: true,
            [icnActive]: currentSlide === i,
          })}
        ></div>,
      );
    }
    return <div className={cn(["rslider-indicator", containerCn])}>{renderedLines}</div>;
  }, [currentSlide]);

  useEffect(() => {
    __setMetaInfo({ numSlides: children.length });
  }, [children.length, __controllerId]);

  const amountOfSlides = children.length;
  const isThereSomethingToLeft = infinite || currentSlide !== 0;
  const isThereSomethingToRight = infinite || currentSlide !== (amountOfSlides - 1);
  const [mouseDown, setMouseDown] = useState<bool>(false);

  const onMouseDown = useCallback((e) => {
    const el = sliderContainerRef.current!;
    initialMouseScrollPos.current = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop };
    setMouseDown(true);
  }, []);

  const onMouseUp = useCallback((e) => {
    setMouseDown(false);
    document.removeEventListener("mousemove", onMouseScrollMove);
    document.removeEventListener("mouseup", onMouseUp);
  }, []);
  const initialMouseScrollPos = useRef({ left: 0, top: 0, x: 0, y: 0 });

  const onMouseScrollMove = useCallback((e) => {
    const dx = e.clientX - initialMouseScrollPos.current.x;
    const dy = e.clientY - initialMouseScrollPos.current.y;
    if (dx < 0) {
      setMouseDown(false);
      nextSlide();
    } else if (dx > 0) {
      setMouseDown(false);
      prevSlide();
    }
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    if (mouseDown) {
      document.addEventListener("mousemove", onMouseScrollMove);
      document.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", onMouseScrollMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [mouseDown, onMouseScrollMove]);

  return (
    <div className={cn([props.className, "rslider"])}>
      <div
        className={cn(["rslider__control", "rslider__left", classes.control])}
        onClick={moveLeft}
        disabled={!isThereSomethingToLeft}
      >
        Left
      </div>
      <div className={cn(["rslider__current"])}>
        <div className={"rslider__view"}>
          <div className={"rslider__content"} ref={sliderContainerRef} onMouseDown={onMouseDown}>
            {renderedSlides}
          </div>
        </div>
        {renderedIndicator}
      </div>
      <div
        className={cn(["rslider__control", "rslider__right", classes.control])}
        onClick={moveRight}
        disabled={!isThereSomethingToRight}
      >
        Right
      </div>
    </div>
  );
};

export default Slider;
