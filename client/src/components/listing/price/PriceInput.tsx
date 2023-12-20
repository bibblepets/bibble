import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectListingCreatorPrice,
  setPrice
} from '../../../features/listingCreatorSlice';
import { store } from '../../../store';

const MAX_PRICE = 9999;

const PriceInput = ({ readOnly }: { readOnly?: boolean }) => {
  const price = useSelector(selectListingCreatorPrice);
  const [sliderValue, setSliderValue] = useState(0);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '');
    const newPrice = parseFloat(value);

    if (newPrice > MAX_PRICE) {
      store.dispatch(setPrice(MAX_PRICE));
    } else {
      store.dispatch(setPrice(newPrice));
    }

    setSliderValue(newPrice);
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSliderValue = parseInt(event.target.value);
    setSliderValue(newSliderValue);
    store.dispatch(setPrice(newSliderValue));
  };

  if (readOnly) {
    return (
      <a className="flex w-full justify-center text-lg underline">${price}</a>
    );
  }

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="relative">
        <span className="absolute left-3 top-[5px] text-lg font-extralight text-gray-500">
          $
        </span>
        <input
          className="text-lg text-center w-full pl-8 pr-2 py-1 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
          type="number"
          min={0}
          step="10"
          placeholder="Enter price"
          value={price}
          onChange={handlePriceChange}
        />
      </div>
      <input
        className="w-5/6"
        type="range"
        min="0"
        max={MAX_PRICE}
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
              width: 16px;
              height: 16px;
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
