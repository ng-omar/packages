import { Locale as DateFnsLocale } from 'date-fns';

export interface ILanguage {
  code: string;
  label: string;
  dir: 'ltr' | 'rtl';
  flag?: string;
  dateFnsLocale?: DateFnsLocale;
}
