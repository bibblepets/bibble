import { useSelector } from 'react-redux';
import {
  selectUserPersonalAddress,
  selectUserPersonalContact,
  selectUserPersonalEmail,
  selectUserPersonalName
} from '../../../features/user/userSlice';
import NameEdit from './edit/NameEdit';
import EmailEdit from './edit/EmailEdit';
import PhoneEdit from './edit/PhoneEdit';
import AddressEdit from './edit/AddressEdit';
import { toAddressString, toMaskedEmail } from '../../../utils/string';

export const useProfileEdit = () => {
  const name = useSelector(selectUserPersonalName);
  const email = useSelector(selectUserPersonalEmail);
  const phone = useSelector(selectUserPersonalContact);
  const address = useSelector(selectUserPersonalAddress);

  return {
    name: {
      label: 'Legal name',
      value: name,
      editDescription:
        "This is the name on your national ID, driver's license, or passport.",
      editComponent: NameEdit
    },
    email: {
      label: 'Email address',
      value: toMaskedEmail(email),
      editDescription: "Use an address you'll always have access to.",
      editComponent: EmailEdit
    },
    phone: {
      label: 'Phone number',
      value: phone,
      editDescription:
        'Contact number (for pet shops or fosterers to get in touch).',
      editComponent: PhoneEdit
    },
    address: {
      label: 'Address',
      value: toAddressString(address),
      editDescription:
        'Use a permanent address where you can receive snail mail.',
      editComponent: AddressEdit
    }
  };
};
