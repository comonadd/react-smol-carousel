import React from "react";

export const ExampleTitle = (props: { title: string; subtitle?: string }) => {
  return (
    <div className="rslider-example__title">
      <h2>{props.title}</h2>
      {props.subtitle && <span>{props.subtitle}</span>}
    </div>
  );
};

export const ExampleContent = (props: { children: any }) => {
  return <div className="rslider-example__content">{props.children}</div>;
};

export const Example = (props: { children: any }) => {
  return <div className="rslider-example">{props.children}</div>;
};

export const ExampleControls = (props: { children: any }) => {
  return <div className="rslider-example__controls">{props.children}</div>;
};
