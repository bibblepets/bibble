import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserIsLoading } from '../../../../features/userSlice';
import SaveButton from './SaveButton';

const PhoneEdit = () => {
  const isLoading = useSelector(selectUserIsLoading);
  const [phone, setPhone] = useState('');

  const onChangePhone = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const phoneRegex = /^[0-9\b]+$/;
      if (event.target.value === '' || phoneRegex.test(event.target.value)) {
        setPhone(event.target.value);
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
      <div className="flex flex-row gap-4">
        <input
          className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={onChangePhone}
        />
      </div>

      <SaveButton onSave={onSave} isLoading={isLoading} />
    </div>
  );
};

export default PhoneEdit;
