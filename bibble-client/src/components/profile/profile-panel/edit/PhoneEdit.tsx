import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectCurrentUser,
  selectUserIsLoading,
  updateUser
} from '../../../../features/userSlice';
import SaveButton from './SaveButton';
import { EditComponentProps } from '../ProfileEditSection';
import { store } from '../../../../store';

const PhoneEdit: React.FC<EditComponentProps> = ({ setEditValue }) => {
  const isLoading = useSelector(selectUserIsLoading);
  const currentUser = useSelector(selectCurrentUser);
  const [contactNumber, setContactNumber] = useState('');

  const onChangePhone = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const phoneRegex = /^[0-9\b]+$/;
      if (event.target.value === '' || phoneRegex.test(event.target.value)) {
        setContactNumber(event.target.value);
      }
    },
    []
  );

  const onSave = useCallback(async () => {
    if (!currentUser) return;

    await store
      .dispatch(
        updateUser({
          contactNumber
        })
      )
      .then(() => {
        setEditValue('');
      });
  }, [store, currentUser, contactNumber]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-row gap-4">
        <input
          className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
          type="text"
          placeholder="Phone number"
          value={contactNumber}
          onChange={onChangePhone}
        />
      </div>

      <SaveButton onSave={onSave} isLoading={isLoading} />
    </div>
  );
};

export default PhoneEdit;
