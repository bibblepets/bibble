import { Address } from '../features/types';

export const toTitleCase = (str?: string) => {
  if (!str) return '';

  const words = str
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_\-]+/g, ' ')
    .toLowerCase()
    .split(' ');

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const toMaskedEmail = (email?: string) => {
  if (!email) return;

  const [name, domain] = email.split('@');

  return `${name[0]}***${name[name.length - 1]}@${domain}`;
};

export const toAddressString = (address?: Address) => {
  if (!address) return;

  const { country, streetAddress, unit, city, postcode } = address;

  return `${unit}, ${streetAddress}, ${country}, ${city}, ${postcode}`;
};
