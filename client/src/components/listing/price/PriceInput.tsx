import React, { useState } from 'react';

const PriceInput = () => {
  const [price, setPrice] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseFloat(event.target.value);
    setPrice(newPrice);
    setSliderValue(newPrice);
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSliderValue = parseFloat(event.target.value);
    setSliderValue(newSliderValue);
    setPrice(newSliderValue);
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="relative">
        <span className="absolute left-3 top-[5px] text-2xl font-extralight text-gray-500">
          $
        </span>
        <input
          className="text-2xl text-center w-full pl-8 pr-2 py-1 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
          type="number"
          min="0"
          step="10"
          placeholder="0"
          value={price}
          onChange={handlePriceChange}
        />
      </div>
      <input
        className="w-full"
        type="range"
        min="0"
        max="10000"
        step="10"
        value={sliderValue}
        onChange={handleSliderChange}
        style={{
          background: 'linear-gradient(to right, #ddd, #ddd)',
          WebkitAppearance: 'none',
          height: '2px'
        }}
      />
      <style>
        {`
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 32px;
              height: 32px;
              background-color: #0ea5e9;
              border-radius: 50%;
              cursor: pointer;
            }
          `}
      </style>
    </div>
  );
};

export default PriceInput;
