import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserIsLoading } from '../../../../features/userSlice';
import SaveButton from './SaveButton';

const NameEdit = () => {
  const isLoading = useSelector(selectUserIsLoading);
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

  const onSave = useCallback(() => {
    // TODO
    alert('TODO');
  }, []);

  return (
    <div className="flex flex-col gap-6 mt-4 w-full">
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

      <SaveButton onSave={onSave} isLoading={isLoading} />
    </div>
  );
};

export default NameEdit;
