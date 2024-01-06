import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectCurrentUser,
  selectUserBio,
  selectUserIsLoading,
  updateUser
} from '../../../../features/userSlice';
import SaveButton from './SaveButton';
import { store } from '../../../../store';

interface BioEditProps {
  editValue: string;
  setEditValue: (value: string) => void;
}

const BioEdit: React.FC<BioEditProps> = ({ editValue, setEditValue }) => {
  const label = 'Biography';
  const isLoading = useSelector(selectUserIsLoading);
  const currentUser = useSelector(selectCurrentUser);
  const bio = useSelector(selectUserBio);
  const [editBio, setEditBio] = useState('');
  const isEditingThis = editValue === label;
  const isEditingOther = editValue !== '' && !isEditingThis;

  const onEdit = useCallback(() => {
    if (isEditingThis) {
      setEditValue('');
    } else {
      setEditValue(label);
    }
  }, [isEditingThis]);

  const onChangeBio = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      console.log(editBio);
      setEditBio(event.target.value);
    },
    []
  );

  const onSave = useCallback(async () => {
    if (!currentUser) return;

    await store
      .dispatch(
        updateUser({
          bio: editBio
        })
      )
      .then(() => {
        setEditValue('');
      });
  }, [store, currentUser, bio]);

  return (
    <div className="flex flex-col gap-8">
      {isEditingThis ? (
        <div className="flex flex-col gap-8">
          <textarea
            className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
            placeholder="Tell us about yourself."
            value={editBio}
            onChange={onChangeBio}
            rows={10}
          />
          <div className="flex flex-row gap-4">
            <SaveButton onSave={onSave} isLoading={isLoading} />
            <button
              onClick={onEdit}
              className={`text-sm font-semibold underline ${
                isEditingOther ? 'text-gray-300' : 'text-gray-800'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : !bio ? (
        <div
          className={`flex flex-col gap-4 font-light rounded-lg border-dashed border p-4 ${
            isEditingOther
              ? 'text-gray-300 border-gray-300'
              : 'text-gray-500 border-gray-500'
          }`}
        >
          Tell us about yourself.
          <div>
            <button
              onClick={onEdit}
              className={`text-sm font-semibold underline ${
                isEditingOther ? 'text-gray-300' : 'text-gray-800'
              }`}
            >
              Add intro
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-800">{bio}</p>
          <div>
            <button
              onClick={onEdit}
              className={`text-sm font-semibold underline ${
                isEditingOther ? 'text-gray-300' : 'text-gray-800'
              }`}
            >
              Edit intro
            </button>
          </div>
        </>
      )}
      <hr />
    </div>
  );
};

export default BioEdit;
