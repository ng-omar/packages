import { IFlattenStrings, IStrings } from '../interfaces';

export const flattenStrings = (strings: IStrings): IFlattenStrings => {
  const result: IFlattenStrings = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(strings)) {
    if (typeof value === 'string') result[key] = value;
    else {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key2, value2] of Object.entries(strings[key])) {
        if (typeof value2 === 'string') result[key2] = value2;
      }
    }
  }

  return result;
};
