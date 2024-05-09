import React, { useState } from 'react';

const YourComponent = () => {
  const [minPrice, setMinPrice] = useState(6.0);
  const [maxPrice, setMaxPrice] = useState(9.0);
  const [minRange, setMinRange] = useState(6.0);
  const [maxRange, setMaxRange] = useState(9.0);

  const priceGap = 0.1;

  const handlePriceInputChange = (e) => {
    const inputName = e.target.className;
    const inputValue = parseFloat(e.target.value);

    if (inputName === "input-min") {
      if (maxPrice - inputValue >= priceGap && inputValue >= parseFloat(minRange)) {
        setMinPrice(inputValue);
        setMinRange(inputValue);
      }
    } else {
      if (inputValue - minPrice >= priceGap && inputValue <= parseFloat(maxRange)) {
        setMaxPrice(inputValue);
        setMaxRange(inputValue);
      }
    }
  };

  const handleRangeInputChange = (e) => {
    const inputName = e.target.className;
    const inputValue = parseFloat(e.target.value);

    if (inputName === "range-min") {
      if (maxPrice - inputValue >= priceGap) {
        setMinRange(inputValue);
        setMinPrice(inputValue);
      }
    } else {
      if (inputValue - minPrice >= priceGap) {
        setMaxRange(inputValue);
        setMaxPrice(inputValue);
      }
    }
  };

  const rangeStyle = {
    left: `${((minPrice / parseFloat(maxRange)) * 100)}%`,
    right: `${100 - ((maxPrice / parseFloat(maxRange)) * 100)}%`
  };

  return (
    <div className="your-component">
      <div className="price-input">
        <div className="field">
          <span>Min</span>
          <input type="number" className="input-min" value={minPrice} step="0.1" onChange={handlePriceInputChange} />
        </div>
        <div className="separator">-</div>
        <div className="field">
          <span>Max</span>
          <input type="number" className="input-max" value={maxPrice} step="0.1" onChange={handlePriceInputChange} />
        </div>
      </div>
      <div className="slider">
        <div className="progress" style={rangeStyle}></div>
      </div>
      <div className="range-input">
        <input id="min_slider" type="range" className="range-min" min="4.0" max="9.0" step="0.1" value={minRange} onChange={handleRangeInputChange} />
        <input id="max_slider" type="range" className="range-max" min="4.0" max="9.0" step="0.1" value={maxRange} onChange={handleRangeInputChange} />
      </div>
      <legend>Your Legend Here</legend>
    </div>
  );
};

export default YourComponent;
