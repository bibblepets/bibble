import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import {
  selectCurrentBusiness,
  updateBusiness
} from '../../../features/business/businessSlice';
import { store } from '../../../store';
import { toAddressString } from '../../../utils/string';
import MapCard from '../../kennel/details/MapCard';
import { BusinessProfileComponentProps } from './BusinessProfileSection';

const EditBusinessProfileLocation: React.FC<BusinessProfileComponentProps> = ({
  setIsEditing
}) => {
  const currentBusiness = useSelector(selectCurrentBusiness);
  const [country, setCountry] = useState(
    currentBusiness?.address.country || ''
  );
  const [streetAddress, setStreetAddress] = useState(
    currentBusiness?.address.streetAddress || ''
  );
  const [unit, setUnit] = useState(currentBusiness?.address.unit || '');
  const [city, setCity] = useState(currentBusiness?.address.city || '');
  const [postcode, setPostcode] = useState(
    currentBusiness?.address.postcode || ''
  );

  const address = {
    country,
    streetAddress,
    unit,
    city,
    postcode
  };

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

  const onSubmit = useCallback(() => {
    const updates = {
      address
    };

    store
      .dispatch(updateBusiness(updates))
      .then(() => {
        setIsEditing(false);
      })
      .catch((error) => {
        toast.error('Failed to update contact information');
      });
  }, [store, address]);

  return (
    <>
      <div className="flex flex-row gap-8 justify-between items-center">
        <h2 className="text-2xl font-medium text-gray-800">Description</h2>
        <button
          onClick={onSubmit}
          className="border rounded-lg px-4 py-1 transition text-gray-400 hover:text-gray-500 hover:border-gray-400"
        >
          <label className="text-sm cursor-pointer">Done</label>
        </button>
      </div>
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
        <MapCard location={toAddressString(address)} />
      </div>
    </>
  );
};

export default EditBusinessProfileLocation;
