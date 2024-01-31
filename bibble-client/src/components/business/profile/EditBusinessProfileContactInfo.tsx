import { useState } from 'react';

const EditBusinessProfileContactInfo = () => {
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onChangeContactNumber = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const phoneRegex = /^[0-9\b]+$/;
    if (event.target.value === '' || phoneRegex.test(event.target.value)) {
      setContactNumber(event.target.value);
    }
  };

  const onChangeInstagramLink = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInstagramLink(event.target.value);
  };

  const onChangeFacebookLink = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFacebookLink(event.target.value);
  };

  const onChangeWebsiteLink = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWebsiteLink(event.target.value);
  };

  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-col gap-4 w-full">
        <label className="flex flex-row gap-8 items-center">
          <span className="text-gray-500 w-48">Email</span>
          <input
            className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
            type="text"
            placeholder="Business name"
            value={email}
            onChange={onChangeEmail}
          />
        </label>
        <label className="flex flex-row gap-8 items-center">
          <span className="text-gray-500 w-48">Contact Number</span>
          <input
            className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
            type="text"
            placeholder="Contact number"
            value={contactNumber}
            onChange={onChangeContactNumber}
          />
        </label>
        <label className="flex flex-row gap-8 items-center">
          <span className="text-gray-500 w-48">Instagram Link</span>
          <input
            className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
            type="text"
            placeholder="Instagram link"
            value={instagramLink}
            onChange={onChangeInstagramLink}
          />
        </label>
        <label className="flex flex-row gap-8 items-center">
          <span className="text-gray-500 w-48">Facebook Link</span>
          <input
            className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
            type="text"
            placeholder="Facebook link"
            value={facebookLink}
            onChange={onChangeFacebookLink}
          />
        </label>
        <label className="flex flex-row gap-8 items-center">
          <span className="text-gray-500 w-48">Website Link</span>
          <input
            className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
            type="text"
            placeholder="Website link"
            value={websiteLink}
            onChange={onChangeWebsiteLink}
          />
        </label>
      </div>
    </div>
  );
};

export default EditBusinessProfileContactInfo;
