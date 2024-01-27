import React from 'react';
import { BiGlobe, BiLogoFacebook, BiLogoInstagram } from 'react-icons/bi';
import { InputProps } from '../../../modules/business/BusinessRegister';
import Input from './Input';

type SocialInputProps = InputProps & {
  facebookLink: string;
  setFacebookLink: (e: React.ChangeEvent<HTMLInputElement>) => void;
  websiteLink: string;
  setWebsiteLink: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SocialInput: React.FC<SocialInputProps> = ({
  value,
  onChange,
  facebookLink,
  setFacebookLink,
  websiteLink,
  setWebsiteLink
}) => {
  return (
    <Input label="Socials" description="Share more through your socials">
      <div className="flex flex-row gap-4">
        <div className="flex flex-row items-center  gap-2 w-full">
          <BiLogoInstagram className="text-2xl text-gray-700" />
          <input
            className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
            type="text"
            placeholder="Instagram"
            value={value}
            onChange={onChange}
          />
        </div>
        <div className="flex flex-row items-center  gap-2 w-full">
          <BiLogoFacebook className="text-2xl text-gray-700" />
          <input
            className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
            type="text"
            placeholder="Faceboook"
            value={facebookLink}
            onChange={setFacebookLink}
          />
        </div>
        <div className="flex flex-row items-center  gap-2 w-full">
          <BiGlobe className="text-2xl text-gray-700" />
          <input
            className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
            type="text"
            placeholder="Website"
            value={websiteLink}
            onChange={setWebsiteLink}
          />
        </div>
      </div>
    </Input>
  );
};

export default SocialInput;
