import { ILanguage } from './language.interface';
import { IStrings } from './strings.interface';

export interface ILanguageConfig {
  languages: ILanguage[];
  defaultLanguage?: string;
  i18nPath?: string;
  requestType?: 'json' | 'http';
  localStorageKey?: string;
  module?: string;
  strings?: IStrings;
}
