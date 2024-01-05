export function validateEmail(email: string): boolean {
  return RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+\.?)|(".+"))@(([a-zA-Z\d-]+\.)+[a-zA-Z]{2,})$/
  ).test(String(email).toLowerCase());
}

export const emailError = 'Email is invalid';
