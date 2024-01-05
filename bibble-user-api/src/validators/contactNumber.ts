export function validateContactNumber(contactNumber: string): boolean {
  console.log(contactNumber);
  return RegExp(/^[0-9\b]+$/).test(contactNumber);
}

export const contactNumberError = 'Contact number is invalid.';
