export function validateCountry(country: string): boolean {
  return country !== '';
}

export const countryError = 'Country is invalid.';

export function validateStreetAddress(streetAddress: string): boolean {
  return streetAddress !== '';
}

export const streetAddressError = 'Street address is invalid.';

export function validateUnit(unit: string): boolean {
  return unit !== '';
}

export const unitError = 'Unit is invalid.';

export function validateCity(city: string): boolean {
  return city !== '';
}

export const cityError = 'City is invalid.';

export function validatePostcode(postcode: string): boolean {
  return postcode !== '';
}

export const postcodeError = 'Postcode is invalid.';
