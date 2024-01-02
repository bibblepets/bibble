import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserIsLoading } from '../../../../features/userSlice';
import SaveButton from './SaveButton';

const AddressEdit = () => {
  const isLoading = useSelector(selectUserIsLoading);
  const [country, setCountry] = useState('');
  const [street, setStreet] = useState('');
  const [unit, setUnit] = useState('');
  const [city, setCity] = useState('');
  const [postCode, setPostCode] = useState('');

  const onChangeCountry = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCountry(event.target.value);
    },
    []
  );

  const onChangeStreet = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setStreet(event.target.value);
    },
    []
  );

  const onChangeUnit = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUnit(event.target.value);
    },
    []
  );

  const onChangeCity = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCity(event.target.value);
    },
    []
  );

  const onChangePostCode = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const postCodeRegex = /^[0-9]{1,6}$/;
      if (event.target.value === '' || postCodeRegex.test(event.target.value)) {
        setPostCode(event.target.value);
      }
    },
    []
  );

  const onSave = useCallback(() => {
    // TODO
    alert('TODO');
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <input
          className={`text-sm w-1/2 p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
          type="text"
          placeholder="Country"
          value={country}
          onChange={onChangeCountry}
        />
        <input
          className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
          type="text"
          placeholder="Street address"
          value={street}
          onChange={onChangeStreet}
        />
        <input
          className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
          type="text"
          placeholder="Unit no."
          value={unit}
          onChange={onChangeUnit}
        />
        <div className="flex flex-row gap-4">
          <input
            className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
            type="text"
            placeholder="City"
            value={city}
            onChange={onChangeCity}
          />
          <input
            className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
            type="text"
            placeholder="Postcode"
            value={postCode}
            onChange={onChangePostCode}
          />
        </div>
      </div>

      <SaveButton onSave={onSave} isLoading={isLoading} />
    </div>
  );
};

export default AddressEdit;
