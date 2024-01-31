import { useState } from 'react';
import { toAddressString } from '../../../utils/string';
import MapCard from '../../kennel/details/MapCard';

const EditBusinessProfileLocation = () => {
  const [country, setCountry] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [unit, setUnit] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');

  const onChangeCountry = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCountry(event.target.value);
  };

  const onChangeStreet = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStreetAddress(event.target.value);
  };

  const onChangeUnit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUnit(event.target.value);
  };

  const onChangeCity = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const onChangePostCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const postCodeRegex = /^[0-9]{1,6}$/;
    if (event.target.value === '' || postCodeRegex.test(event.target.value)) {
      setPostcode(event.target.value);
    }
  };

  const address = toAddressString({
    country,
    streetAddress,
    unit,
    city,
    postcode
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <label className="flex flex-row gap-8 items-center">
          <span className="text-gray-500 w-40">Country</span>
          <input
            className={`text-sm w-1/3 p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
            type="text"
            placeholder="Country"
            value={country}
            onChange={onChangeCountry}
          />
        </label>
        <label className="flex flex-row gap-8 items-center">
          <span className="text-gray-500 w-40">Street Address</span>
          <input
            className={`text-sm w-1/3 p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
            type="text"
            placeholder="Street address"
            value={streetAddress}
            onChange={onChangeStreet}
          />
        </label>
        <label className="flex flex-row gap-8 items-center">
          <span className="text-gray-500 w-40">Unit Number</span>
          <input
            className={`text-sm w-1/3 p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
            type="text"
            placeholder="Unit no."
            value={unit}
            onChange={onChangeUnit}
          />
        </label>
        <label className="flex flex-row gap-8 items-center w-full">
          <span className="text-gray-500 w-40">City</span>
          <input
            className={`text-sm w-1/3 p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
            type="text"
            placeholder="City"
            value={city}
            onChange={onChangeCity}
          />
        </label>
        <label className="flex flex-row gap-8 items-center w-full">
          <span className="text-gray-500 w-40">Postal Code</span>
          <input
            className={`text-sm w-1/3 p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
            type="text"
            placeholder="Postcode"
            value={postcode}
            onChange={onChangePostCode}
          />
        </label>
      </div>
      <MapCard location={address} height={800} />
    </div>
  );
};

export default EditBusinessProfileLocation;
