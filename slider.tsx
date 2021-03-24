import React from "react";
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
  infinite?: boolean;
  startingSlide?: number;
}

interface SliderControllerMetaInfo {
  numSlides: number;
}

let __globalCRId = 0;
export const useSliderController = (options: SliderControllerOptions = {}): SliderController => {
  const infinite = options.infinite ?? false;
  const __controllerId = React.useMemo(() => {
    const res = __globalCRId;
    ++__globalCRId;
    return res;
  }, []);
  const startingSlide = options.startingSlide ?? 0;
  const [currentSlide, setCurrentSlide] = React.useState<number>(startingSlide);
  const [metaInfo, setMetaInfo] = React.useState<SliderControllerMetaInfo | null>(null);
  const prevSlide = React.useCallback(() => {
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
  const nextSlide = React.useCallback(() => {
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
  const __setMetaInfo = React.useCallback(setMetaInfo);
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
  console.log("controller #" + __controllerId);
  const classes = props.classes ?? {};
  const numSlides = children.length;
  const moveLeft = () => {
    prevSlide();
  };
  const moveRight = () => {
    nextSlide();
  };
  const slidesRef = React.useRef([]);
  const renderedSlides = React.useMemo(() => {
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
  const sliderContainerRef = React.useRef(null);
  React.useLayoutEffect(() => {
    console.log(slidesRef);
    if (slidesRef.current.length === 0) return;
    const elem = slidesRef.current[currentSlide].current;
    console.log(elem);
    sliderContainerRef.current.scrollLeft = elem.offsetLeft;
    console.log("set: " + sliderContainerRef.current.scrollLeft + " because of " + elem.offsetLeft);
  }, [renderedSlides]);
  const renderedIndicator = React.useMemo(() => {
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
  React.useEffect(() => {
    __setMetaInfo({ numSlides: children.length });
  }, [children.length, __controllerId]);
  return (
    <div className={cn([props.className, "rslider"])}>
      <div className={cn(["rslider__control", "rslider__left"])} onClick={moveLeft}>
        Left
      </div>
      <div className={cn(["rslider__current"])}>
        <div className={"rslider__view"}>
          <div className={"rslider__content"} ref={sliderContainerRef}>
            {renderedSlides}
          </div>
        </div>
        {renderedIndicator}
      </div>
      <div className={cn(["rslider__control", "rslider__right"])} onClick={moveRight}>
        Right
      </div>
    </div>
  );
};

export default Slider;
