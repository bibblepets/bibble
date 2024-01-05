export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export const passwordError = 'Password must be at least 6 characters long.';
