export function validateName(name: string): boolean {
  return name.length > 2;
}

export const nameError = 'Name must be at least 3 characters long';
