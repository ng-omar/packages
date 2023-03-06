import { ILanguage } from './language.interface';
import { IStrings } from './strings.interface';

export interface ITranslationConfig {
  languages: ILanguage[];
  defaultLanguage?: string;
  localStorageKey?: string;
  i18nFolderPath?: string;
  translationEndpoint?: string;
  strings?: IStrings;
  module?: string;
}
