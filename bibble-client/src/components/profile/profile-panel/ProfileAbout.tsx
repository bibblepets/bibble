import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../features/user/userSlice';
import { useSearchParams } from 'react-router-dom';

const ProfileAbout = () => {
  const currentUser = useSelector(selectCurrentUser);
  const [searchParams, setSearchParams] = useSearchParams();

  const onEdit = useCallback(() => {
    const editValue = searchParams.get('edit');

    if (editValue === 'true') {
      searchParams.delete('edit');
    } else {
      searchParams.set('edit', 'true');
    }
    setSearchParams(searchParams);
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-800">
          About {currentUser?.firstName}
        </h1>
        <div>
          <button
            onClick={onEdit}
            className="border border-gray-600 transition hover:bg-gray-200 rounded-full py-2 px-4 text-sm"
          >
            Edit profile
          </button>
        </div>
      </div>
      <p className="text-gray-800 whitespace-pre">{currentUser?.bio}</p>
    </div>
  );
};

export default ProfileAbout;
