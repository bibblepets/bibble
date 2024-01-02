import { useSelector } from 'react-redux';
import {
  selectUserPersonalAddress,
  selectUserPersonalContact,
  selectUserPersonalEmail,
  selectUserPersonalGovernmentId,
  selectUserPersonalName
} from '../../../features/userSlice';
import NameEdit from './edit/NameEdit';
import EmailEdit from './edit/EmailEdit';
import PhoneEdit from './edit/PhoneEdit';
import IdEdit from './edit/IdEdit';
import AddressEdit from './edit/AddressEdit';
import { toMaskedEmail } from '../../../utils/string';

export const useProfileEdit = () => {
  const name = useSelector(selectUserPersonalName);
  const email = useSelector(selectUserPersonalEmail);
  const phone = useSelector(selectUserPersonalContact);
  const hasId = useSelector(selectUserPersonalGovernmentId);
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
    id: {
      label: 'Government ID',
      value: hasId,
      editDescription:
        'For our records, we need to know if you have a government ID.',
      editComponent: IdEdit
    },
    address: {
      label: 'Address',
      value: address,
      editDescription:
        'Use a permanent address where you can receive snail mail.',
      editComponent: AddressEdit
    }
  };
};
