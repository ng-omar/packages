import { RequestType } from '../types';

export const getI18nUrl = (
  i18nPath: string,
  module: string,
  languageCode: string,
  requestType: RequestType
): string => {
  return `${i18nPath}${
    requestType === 'http' ? '/modules' : ''
  }/${module}/${languageCode}${requestType === 'json' ? '.json' : ''}`;
};
