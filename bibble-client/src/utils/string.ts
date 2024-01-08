import { Address } from '../features/types';

export const toCamelCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[_-](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (_, char) => char.toUpperCase());
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
