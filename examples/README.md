react-slide
===========

React carousel library with types

# Example

```
const ControllableExample = () => {
  // This is a controller you can use to communicate with the slider
  const slider = useSliderController({
    // options go here
    infinite: true,
  });
  // Reacts to current slide change
  React.useEffect(() => {
    console.log(`Current slide: ${slider.currentSlide}`);
  }, [slider.currentSlide]);
  // Switches on a keyboard event and goes left / right based on the input
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
  // Each child of a Slider acts as a separate slide
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
```
