import { InjectionToken } from '@angular/core';
import { ILanguage, IStrings } from '../interfaces';

export const IS_ROOT_TOKEN = new InjectionToken<boolean>('IS_ROOT');
export const LANGUAGES_TOKEN = new InjectionToken<ILanguage[]>('LANGUAGES');
export const DEFAULT_LANGUAGE_TOKEN = new InjectionToken<string>(
  'DEFAULT_LANGUAGE'
);
export const LOCAL_STORAGE_KEY_TOKEN = new InjectionToken<string>(
  'LOCAL_STORAGE_KEY'
);
export const I18N_FOLDER_PATH_TOKEN = new InjectionToken<string>(
  'I18N_FOLDER_PATH'
);
export const TRANSLATION_END_POINT_TOKEN = new InjectionToken<string>(
  'TRANSLATION_END_POINT'
);
export const STRINGS_TOKEN = new InjectionToken<IStrings>('STRINGS');
export const MODULE_TOKEN = new InjectionToken<string>('MODULE');
