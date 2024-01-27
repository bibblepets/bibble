import { useState } from 'react';
import AddressInput from '../../components/business/register/AddressInput';
import ContactInput from '../../components/business/register/ContactInput';
import DescriptionInput from '../../components/business/register/DescriptionInput';
import EmailInput from '../../components/business/register/EmailInput';
import NameInput from '../../components/business/register/NameInput';
import PasswordInput from '../../components/business/register/PasswordInput';
import SocialInput from '../../components/business/register/SocialInput';
import BusinessLayout from '../../layouts/BusinessLayout';
import logoIcon from '/images/logo-icon.png';

export type InputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const BusinessRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contact: '',
    country: '',
    streetAddress: '',
    unit: '',
    city: '',
    postcode: '',
    description: '',
    instagramLink: '',
    facebookLink: '',
    websiteLink: ''
  });

  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value
      }));
    };

  return (
    <BusinessLayout>
      <div className="flex flex-col justify-center items-center pt-[86px] pb-[84px] px-4 gap-12">
        {/* HEADER */}
        <div className="flex flex-col items-center w-full gap-8">
          <img className="h-[32px]" src={logoIcon} alt="bibble-logo" />
          <h1 className="text-3xl text-gray-800 font-semibold">
            Welcome to Bibble Business
          </h1>
        </div>

        {/* FORM */}
        <form className="flex flex-col items-center w-full gap-8">
          <NameInput
            value={formData.name}
            onChange={handleInputChange('name')}
          />
          <EmailInput
            value={formData.email}
            onChange={handleInputChange('email')}
          />
          <PasswordInput
            value={formData.password}
            onChange={handleInputChange('password')}
            confirmPassword={formData.confirmPassword}
            setConfirmPassword={handleInputChange('confirmPassword')}
          />
          <ContactInput
            value={formData.contact}
            onChange={handleInputChange('contact')}
          />
          <AddressInput
            value={formData.country}
            onChange={handleInputChange('country')}
            streetAddress={formData.streetAddress}
            setStreetAddress={handleInputChange('streetAddress')}
            unit={formData.unit}
            setUnit={handleInputChange('unit')}
            city={formData.city}
            setCity={handleInputChange('city')}
            postcode={formData.postcode}
            setPostcode={handleInputChange('postcode')}
          />
          <DescriptionInput
            value={formData.description}
            onChange={handleInputChange('description')}
          />
          <SocialInput
            value={formData.instagramLink}
            onChange={handleInputChange('instagramLink')}
            facebookLink={formData.facebookLink}
            setFacebookLink={handleInputChange('facebookLink')}
            websiteLink={formData.websiteLink}
            setWebsiteLink={handleInputChange('websiteLink')}
          />
        </form>
      </div>
    </BusinessLayout>
  );
};

export default BusinessRegister;
