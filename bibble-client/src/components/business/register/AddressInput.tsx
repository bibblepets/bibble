import React from 'react';
import { InputProps } from '../../../modules/business/BusinessRegister';
import Input from './Input';

type AddressInputProps = InputProps & {
  streetAddress: string;
  setStreetAddress: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit: string;
  setUnit: (e: React.ChangeEvent<HTMLInputElement>) => void;
  city: string;
  setCity: (e: React.ChangeEvent<HTMLInputElement>) => void;
  postcode: string;
  setPostcode: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  streetAddress,
  setStreetAddress,
  unit,
  setUnit,
  city,
  setCity,
  postcode,
  setPostcode
}) => {
  return (
    <Input label="Address" description="Where's your business?">
      <div className="flex flex-col gap-4">
        <input
          className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
          type="text"
          placeholder="Country"
          value={value}
          onChange={onChange}
        />
        <input
          className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
          type="text"
          placeholder="Street address"
          value={streetAddress}
          onChange={setStreetAddress}
        />
        <input
          className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
          type="text"
          placeholder="Unit no."
          value={unit}
          onChange={setUnit}
        />
        <div className="flex flex-row gap-4">
          <input
            className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
            type="text"
            placeholder="City"
            value={city}
            onChange={setCity}
          />
          <input
            className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
            type="text"
            placeholder="Postal code"
            value={postcode}
            onChange={setPostcode}
          />
        </div>
      </div>
    </Input>
  );
};

export default AddressInput;
