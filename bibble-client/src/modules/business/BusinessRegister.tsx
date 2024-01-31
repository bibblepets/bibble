import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddressInput from '../../components/business/register/AddressInput';
import ContactInput from '../../components/business/register/ContactInput';
import DescriptionInput from '../../components/business/register/DescriptionInput';
import EmailInput from '../../components/business/register/EmailInput';
import MediaUploadModal from '../../components/business/register/MediaUploadModal';
import NameInput from '../../components/business/register/NameInput';
import PasswordInput from '../../components/business/register/PasswordInput';
import SocialInput from '../../components/business/register/SocialInput';
import {
  registerBusiness,
  selectCurrentBusiness
} from '../../features/business/businessSlice';
import BusinessLayout from '../../layouts/BusinessLayout';
import { store } from '../../store';
import logoIcon from '/images/logo-icon.png';

export type InputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const BusinessRegister = () => {
  const currentBusiness = useSelector(selectCurrentBusiness);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
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

  const handleSubmit = useCallback(() => {
    if (formData.password !== formData.confirmPassword) {
      alert('Password and confirm password do not match');
      return;
    }

    store.dispatch(
      registerBusiness({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        contactNumber: formData.contact,
        address: {
          country: formData.country,
          streetAddress: formData.streetAddress,
          unit: formData.unit,
          city: formData.city,
          postcode: formData.postcode
        },
        description: formData.description,
        instagramLink: formData.instagramLink,
        facebookLink: formData.facebookLink,
        websiteLink: formData.websiteLink
      })
    );
  }, [store, formData]);

  const onClose = useCallback(() => {
    setIsOpen(false);
    navigate('/business');
  }, []);

  useEffect(() => {
    if (currentBusiness && currentBusiness.media.length === 0) {
      setIsOpen(true);
    } else if (currentBusiness) {
      navigate('/business');
    }
  }, [navigate, currentBusiness]);

  return (
    <BusinessLayout small>
      {isOpen && <MediaUploadModal isOpen={isOpen} onClose={onClose} />}
      <div className="flex flex-col justify-center items-center px-4 gap-12">
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

        {/* BUTTON */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/business/login" className="font-semibold text-sky-500">
              Log in here
            </a>
          </p>
          <button
            onClick={handleSubmit}
            className="bg-sky-500 rounded-lg text-white font-medium py-2 px-8 transition hover:scale-105 hover:opacity-80"
          >
            Register
          </button>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default BusinessRegister;
