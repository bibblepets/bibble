import ProfileEditSection from './ProfileEditSection';
import { useProfileEdit } from './hooks';

const ProfileEdit = () => {
  const profile = useProfileEdit();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-gray-800">Personal info</h1>

      {Object.entries(profile).map(([key, value]) => (
        <ProfileEditSection
          key={key}
          label={value.label}
          value={value.value}
          editDescription={value.editDescription}
          editComponent={value.editComponent}
        />
      ))}
    </div>
  );
};

export default ProfileEdit;
