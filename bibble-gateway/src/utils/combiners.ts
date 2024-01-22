import { ICombinableObject } from '../interfaces/combiner.interface';

export const appendData = (
  a: ICombinableObject,
  b: ICombinableObject
): ICombinableObject => {
  return { ...a, ...b };
};

export const appendDataForEach = (
  a: ICombinableObject | ICombinableObject[],
  b: ICombinableObject | ICombinableObject[]
): ICombinableObject | ICombinableObject[] => {
  const arrA = Array.isArray(a) ? a : [a];
  const arrB = Array.isArray(b) ? b : [b];

  return arrA.map((x: ICombinableObject, i: number) => ({
    ...x,
    ...arrB[i]
  }));
};
