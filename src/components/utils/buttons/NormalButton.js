import React from "react";

import "./NormalButton.scss";
const NormalButton = (props) => {
  const { onClick, style, href, disabled, type, className } = props;
  if (href) {
    return (
      <a href={href} target="_blank" className={className+" normal_button grow"} rel="noreferrer">
        {props.children}
      </a>
    );
  }
  return (
    <button
      type={type}
      className={className+" normal_button grow"}
      style={style}
      onClick={onClick}
      disabled={disabled === true || disabled === "true" ? true : false}
    >
      {props.children}
    </button>
  );
};

export default NormalButton;
