import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectCurrentUser,
  selectUserIsLoading,
  updateUser
} from '../../../../features/user/userSlice';
import { store } from '../../../../store';
import { EditComponentProps } from '../user/UserProfileEditSection';
import SaveButton from './SaveButton';

const NameEdit: React.FC<EditComponentProps> = ({ setEditValue }) => {
  const isLoading = useSelector(selectUserIsLoading);
  const currentUser = useSelector(selectCurrentUser);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const onChangeFirstName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFirstName(event.target.value);
    },
    []
  );

  const onChangeLastName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLastName(event.target.value);
    },
    []
  );

  const onSave = useCallback(async () => {
    if (!currentUser) return;

    await store
      .dispatch(
        updateUser({
          firstName,
          lastName
        })
      )
      .then(() => {
        setEditValue('');
      });
  }, [store, currentUser, firstName, lastName]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-row gap-4">
        <input
          className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={onChangeFirstName}
        />
        <input
          className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={onChangeLastName}
        />
      </div>

      <SaveButton
        onSave={onSave}
        isLoading={isLoading}
        disabled={!firstName || !lastName}
      />
    </div>
  );
};

export default NameEdit;
