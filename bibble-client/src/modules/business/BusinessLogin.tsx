import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EmailInput from '../../components/business/register/EmailInput';
import PasswordInput from '../../components/business/register/PasswordInput';
import {
  loginBusiness,
  selectCurrentBusiness
} from '../../features/business/businessSlice';
import BusinessLayout from '../../layouts/BusinessLayout';
import { store } from '../../store';
import logoIcon from '/images/logo-icon.png';

const BusinessLogin = () => {
  const currentBusiness = useSelector(selectCurrentBusiness);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    store.dispatch(loginBusiness(formData));
  }, [store, formData]);

  useEffect(() => {
    if (currentBusiness) {
      navigate('/business');
    }
  }, [navigate, currentBusiness]);

  return (
    <BusinessLayout small>
      <div className="flex flex-col justify-center items-center px-4 gap-12">
        {/* HEADER */}
        <div className="flex flex-col items-center w-full gap-8">
          <img className="h-[32px]" src={logoIcon} alt="bibble-logo" />
          <h1 className="text-3xl text-gray-800 font-semibold">
            Login to Bibble Business
          </h1>
        </div>

        {/* FORM */}
        <form className="flex flex-col items-center w-full gap-8">
          <EmailInput
            value={formData.email}
            onChange={handleInputChange('email')}
          />
          <PasswordInput
            value={formData.password}
            onChange={handleInputChange('password')}
          />
        </form>

        {/* BUTTON */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="/business/register" className="font-semibold text-sky-500">
              Register here
            </a>
          </p>
          <button
            onClick={handleSubmit}
            className="bg-sky-500 rounded-lg text-white font-medium py-2 px-8 transition hover:scale-105 hover:opacity-80"
          >
            Sign in
          </button>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default BusinessLogin;
