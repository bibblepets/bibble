import React from 'react';
import { useSelector } from 'react-redux';
import { store } from '../../../../store';
import {
  selectListingEditorGender,
  selectListingEditorWeight,
  setWeight
} from '../../../../features/listingEditorSlice';

const WeightInput = () => {
  const selectedGender = useSelector(selectListingEditorGender);
  const weight = useSelector(selectListingEditorWeight);

  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number = event.target.value;
    if (value === '') {
      value = '0';
    }
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      return;
    } else if (parsedValue > 99) {
      store.dispatch(setWeight(99));
    } else {
      store.dispatch(setWeight(parsedValue));
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-sm text-gray-500">
        How heavy is {selectedGender === 'Male' ? 'he' : 'she'}?
      </p>
      <div className="flex flex-row items-center gap-2">
        <input
          className="w-24 p-2 text-end text-gray-700 text-6xl rounded-md focus:outline-none focus:shadow-outline"
          type="text"
          min={0}
          step="0.1"
          placeholder="Enter weight"
          value={weight || ''}
          onChange={handleWeightChange}
        />
        <p className="text-6xl text-gray-500 w-24">kg</p>
      </div>
    </div>
  );
};

export default WeightInput;
