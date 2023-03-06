import { InjectionToken } from '@angular/core';
import { ILanguage, IStrings } from '../interfaces';
import { RequestType } from '../types';

export const LANGUAGES_TOKEN = new InjectionToken<ILanguage[]>('LANGUAGES');
export const DEFAULT_LANGUAGE_TOKEN = new InjectionToken<string>(
  'DEFAULT_LANGUAGE'
);
export const I18N_PATH_TOKEN = new InjectionToken<string>('I18N_PATH');
export const REQUEST_TYPE_TOKEN = new InjectionToken<RequestType>(
  'REQUEST_TYPE'
);
export const LOCAL_STORAGE_KEY_TOKEN = new InjectionToken<string>(
  'LOCAL_STORAGE_KEY'
);
export const MODULE_TOKEN = new InjectionToken<string>('MODULE');
export const STRINGS_TOKEN = new InjectionToken<IStrings>('STRINGS');
export const IS_ROOT_TOKEN = new InjectionToken<boolean>('IS_ROOT');
