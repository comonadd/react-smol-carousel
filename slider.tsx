import React, {
  useLayoutEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";
import "./slider.css";
import cn from "classnames";

declare const process: any;

type SCRR = React.Ref<HTMLDivElement>;
interface SliderController {
  nextSlide: () => void;
  prevSlide: () => void;
  currentSlide: number;
  setCurrentSlide: (i: number) => void;
  __controllerId: number;
  __setMetaInfo: (rr: SliderControllerMetaInfo) => void;
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
export const useSliderController = (
  options: SliderControllerOptions = {}
): SliderController => {
  const infinite = options.infinite ?? false;
  const __controllerId = useMemo(() => {
    const res = __globalCRId;
    ++__globalCRId;
    return res;
  }, []);
  const startingSlide = options.startingSlide ?? 0;
  const [currentSlide, setCurrentSlide] = useState<number>(startingSlide);
  const [metaInfo, setMetaInfo] = useState<SliderControllerMetaInfo | null>(
    null
  );
  const prevSlide = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      console.assert(metaInfo !== null, "No meta info set");
    }
    const { numSlides } = metaInfo!;
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
    const { numSlides } = metaInfo!;
    if (currentSlide === numSlides - 1) {
      if (infinite) {
        setCurrentSlide(0);
      }
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  }, [currentSlide, metaInfo]);
  const __setMetaInfo = setMetaInfo;
  return {
    currentSlide,
    nextSlide,
    prevSlide,
    setCurrentSlide,
    __setMetaInfo,
    __controllerId,
  };
};

export enum SliderIndicator {
  Dots,
  Lines,
}

export interface SliderProps extends SliderControllerOptions {
  indicator?: SliderIndicator;
  enableKeys?: boolean; // enable arrow keys
  indicatorClickable?: boolean; // enable navigation with indicator click
  children: any;
  className?: string;
  controller?: SliderController;
  classes?: {
    container?: string;
    control?: string;
    slide?: string;
  };
  renderPrevControl?: (props: {
    isTherePrevSlide: boolean;
    prevSlide: () => void;
  }) => React.ReactElement;
  renderNextControl?: (props: {
    isThereNextSlide: boolean;
    nextSlide: () => void;
  }) => React.ReactElement;
}

const styles: any = {};

const itcn = {
  [SliderIndicator.Lines]: "rslider__line-indicator",
  [SliderIndicator.Dots]: "rslider__dots-indicator",
};

const Slider = (props: SliderProps) => {
  const {
    indicatorClickable = false,
    enableKeys = false,
    indicator,
    children,
    infinite,
  } = props;
  const {
    __controllerId,
    setCurrentSlide,
    __setMetaInfo,
    nextSlide,
    prevSlide,
    currentSlide,
  } = props.controller ?? useSliderController(props);
  const classes = props.classes ?? {};
  const numSlides = children.length;
  const moveLeft = () => {
    prevSlide();
  };
  const moveRight = () => {
    nextSlide();
  };
  const slidesRef = useRef<any[]>([]);
  const renderedSlides = useMemo(() => {
    return children.map((slide: any, idx: number) => {
      const active = idx === currentSlide;
      slidesRef.current[idx] = React.createRef();
      return (
        <div
          key={idx}
          className={cn(["rslider-slide", classes.slide], {
            "rslider-slide_active": active,
          })}
          ref={slidesRef.current[idx]}
        >
          {slide}
        </div>
      );
    });
  }, [children, currentSlide]);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (slidesRef.current.length === 0) return;
    if (sliderContainerRef.current === null) return;
    const elem = (slidesRef.current![currentSlide] as any).current;
    sliderContainerRef.current!.scrollLeft = elem.offsetLeft;
  }, [renderedSlides]);

  const renderedIndicator = useMemo(() => {
    if (indicator === undefined) return null;
    const containerCn = itcn[indicator];
    if (process.env.NODE_ENV === "development") {
      if (!containerCn) {
        console.assert(
          false,
          "Invalid indicator type passed in, please use the exported enum SliderIndicator"
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
          onClick={() => {
            if (indicatorClickable) {
              setCurrentSlide(i);
            }
          }}
        ></div>
      );
    }
    return (
      <div className={cn(["rslider-indicator", containerCn])}>
        {renderedLines}
      </div>
    );
  }, [currentSlide]);

  useEffect(() => {
    __setMetaInfo({ numSlides: children.length });
  }, [children.length, __controllerId]);

  const amountOfSlides = children.length;
  const isThereSomethingToLeft = infinite || currentSlide !== 0;
  const isThereSomethingToRight =
    infinite || currentSlide !== amountOfSlides - 1;
  const [mouseDown, setMouseDown] = useState<boolean>(false);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    const el = sliderContainerRef.current!;
    initialMouseScrollPos.current = {
      x: e.clientX,
      y: e.clientY,
      left: el.scrollLeft,
      top: el.scrollTop,
    };
    setMouseDown(true);
  }, []);

  const onMouseUp = useCallback((e) => {
    setMouseDown(false);
    document.removeEventListener("mousemove", onMouseScrollMove);
    document.removeEventListener("mouseup", onMouseUp);
  }, []);
  const initialMouseScrollPos = useRef({ left: 0, top: 0, x: 0, y: 0 });

  const onMouseScrollMove = useCallback(
    (e) => {
      const dx = e.clientX - initialMouseScrollPos.current.x;
      const dy = e.clientY - initialMouseScrollPos.current.y;
      if (dx < 0) {
        setMouseDown(false);
        nextSlide();
      } else if (dx > 0) {
        setMouseDown(false);
        prevSlide();
      }
    },
    [nextSlide, prevSlide]
  );

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

  const onContainerKeyDown = React.useCallback(
    (e) => {
      switch (e.keyCode) {
        case 37:
          {
            // left
            // disable default scrolling behaviour for arrow keys
            e.preventDefault();
            if (enableKeys) {
              prevSlide();
            }
          }
          break;
        case 39:
          // right
          e.preventDefault();
          if (enableKeys) {
            nextSlide();
          }
          break;
      }
    },
    [prevSlide, nextSlide, enableKeys]
  );

  useEffect(() => {
    if (sliderContainerRef.current) {
      sliderContainerRef.current!.addEventListener(
        "keydown",
        onContainerKeyDown,
        false
      );
    }
    return () => {
      if (sliderContainerRef.current) {
        sliderContainerRef.current!.removeEventListener(
          "keydown",
          onContainerKeyDown,
          false
        );
      }
    };
  }, [onContainerKeyDown]);

  const renderedPrevControl = props.renderPrevControl ? (
    props.renderPrevControl({
      isTherePrevSlide: isThereSomethingToLeft,
      prevSlide: moveLeft,
    })
  ) : (
    <div
      className={cn(["rslider__control", "rslider__left", classes.control])}
      onClick={moveLeft}
      {...({ disabled: !isThereSomethingToLeft } as any)}
    >
      Left
    </div>
  );

  const renderedNextControl = props.renderNextControl ? (
    props.renderNextControl({
      isThereNextSlide: isThereSomethingToRight,
      nextSlide: moveRight,
    })
  ) : (
    <div
      className={cn(["rslider__control", "rslider__right", classes.control])}
      onClick={moveRight}
      {...({ disabled: !isThereSomethingToRight } as any)}
    >
      Right
    </div>
  );

  return (
    <div
      className={cn([props.className, "rslider"])}
      onClick={(e) => {
        sliderContainerRef.current!.focus();
      }}
    >
      {renderedPrevControl}
      <div className={cn(["rslider__current"])}>
        <div className={"rslider__view"}>
          <div
            className={"rslider__content"}
            tabIndex={0}
            ref={sliderContainerRef}
            onMouseDown={onMouseDown}
          >
            {renderedSlides}
          </div>
        </div>
        {renderedIndicator}
      </div>
      {renderedNextControl}
    </div>
  );
};

export default Slider;
