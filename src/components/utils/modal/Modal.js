import React from "react";

import "./Modal.scss";

const Modal = ({ children, style }) => {
  return (
    <div className="modalContainer" style={style}>
      {children}
    </div>
  );
};

export default Modal;
