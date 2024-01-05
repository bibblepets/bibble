import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { store } from '../../../../store';
import {
  selectListingEditorPrice,
  setPrice
} from '../../../../features/listingEditorSlice';

const MAX_PRICE = 9999;

const PriceInput = () => {
  const price = useSelector(selectListingEditorPrice);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number = event.target.value;
    if (value === '') {
      value = '0';
    }
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      return;
    } else if (parsedValue > MAX_PRICE) {
      store.dispatch(setPrice(MAX_PRICE));
    } else {
      store.dispatch(setPrice(parsedValue));
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <p className="text-xs text-gray-500">An impossible question, we know.</p>
      <div className="flex items-center">
        <span className="text-end text-6xl xs:text-8xl font-light p-2 text-gray-500 w-20">
          $
        </span>
        <input
          className={`text-start text-8xl p-2 text-gray-800 focus:outline-none text-center w-64`}
          type="text"
          value={price}
          placeholder="..."
          onChange={handlePriceChange}
          maxLength={50}
        />
      </div>
    </div>
  );
};

export default PriceInput;
