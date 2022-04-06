import React from "react";

import "./CounterField.scss";

const CounterField = (props) => {
  const { id, quantity, setQuantity, max, min, readOnly, onChange } = props;

  const increaseQuantity = () => {
    if (quantity < max) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div id={id} className="counter-div">
      {readOnly && (
        <button type="button" className="grow" onClick={decreaseQuantity}>
          {"<"}
        </button>
      )}

      <input
        type="number"
        value={quantity}
        min={min}
        max={max}
        readOnly={readOnly ? "readOnly" : ""}
        onChange={onChange}
      />
      {readOnly && (
        <button type="button" className="grow" onClick={increaseQuantity}>
          {">"}
        </button>
      )}
    </div>
  );
};

export default CounterField;
