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

const EmailEdit: React.FC<EditComponentProps> = ({ setEditValue }) => {
  const isLoading = useSelector(selectUserIsLoading);
  const currentUser = useSelector(selectCurrentUser);
  const [email, setEmail] = useState('');

  const onChangeEmail = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
    },
    []
  );

  const onSave = useCallback(async () => {
    if (!currentUser) return;

    await store
      .dispatch(
        updateUser({
          ...currentUser,
          email
        })
      )
      .then(() => {
        setEditValue('');
      });
  }, [store, currentUser, email]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-row gap-4">
        <input
          className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
          type="text"
          placeholder="Email address"
          value={email}
          onChange={onChangeEmail}
        />
      </div>

      <SaveButton onSave={onSave} isLoading={isLoading} />
    </div>
  );
};

export default EmailEdit;
