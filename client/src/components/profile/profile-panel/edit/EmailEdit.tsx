import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserIsLoading } from '../../../../features/userSlice';
import SaveButton from './SaveButton';

const EmailEdit = () => {
  const isLoading = useSelector(selectUserIsLoading);
  const [email, setEmail] = useState('');

  const onChangeEmail = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
    },
    []
  );

  const onSave = useCallback(() => {
    // TODO
    alert('TODO');
  }, []);

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
