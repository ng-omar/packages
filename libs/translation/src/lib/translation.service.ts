import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { DateFnsConfigurationService } from 'ngx-date-fns';
import { ILanguage, IStrings } from './interfaces';
import { RequestType } from './types';
import { flattenStrings, getI18nUrl } from './utils';

@Injectable()
export class TranslationService {
  public languages: ILanguage[] = [];

  public i18nPath?: string;

  public requestType!: RequestType;

  private localStorageKey!: string;

  private defaultLanguage?: string;

  public constructor(
    private readonly http: HttpClient,
    private readonly translateService: TranslateService,
    private readonly rendererFactory: RendererFactory2,
    private readonly dateFnsConfig: DateFnsConfigurationService
  ) {}

  public get currentLanguage(): ILanguage {
    const currentLang = this.getLanguage(this.translateService.currentLang);
    if (!currentLang) throw new Error('Language not found');
    return currentLang;
  }

  public init(
    languages: ILanguage[],
    defaultLanguage?: string,
    i18nPath?: string,
    requestType: RequestType = 'json',
    localStorageKey = 'selected-language',
    module = 'default',
    strings?: IStrings
  ): void {
    this.languages = languages;
    this.i18nPath = i18nPath;
    this.localStorageKey = localStorageKey;
    this.defaultLanguage = defaultLanguage;
    this.requestType = requestType;

    const selectedLanguage = this.getSavedUserLanguageOrDefault();

    const renderer = this.rendererFactory.createRenderer(null, null);
    this.setLanguage(selectedLanguage, renderer);
    this.translateService.addLangs(this.languages.map((l) => l.code));
    if (defaultLanguage) this.translateService.setDefaultLang(defaultLanguage);
    this.translateService.use(selectedLanguage.code);

    if (i18nPath) this.loadStringsFromModule(module).subscribe();
    if (strings) this.setTranslations(strings);

    if (selectedLanguage.dateFnsLocale) {
      this.dateFnsConfig.setLocale(selectedLanguage.dateFnsLocale);
    }
  }

  public setLanguage(language: ILanguage, renderer?: Renderer2): void {
    localStorage.setItem(this.localStorageKey, language.code);

    if (!renderer) {
      window.location.reload();
      return;
    }

    const { documentElement } = window.document;
    renderer.setAttribute(documentElement, 'lang', language.code);
    renderer.setAttribute(documentElement, 'dir', language.dir);
    this.translateService.use(language.code);
  }

  public loadStringsFromModule(module: string): Observable<{ isLoaded: true }> {
    return this.http.get<IStrings>(this.getI18nPath(module)).pipe(
      tap(this.setTranslations.bind(this)),
      map(() => ({ isLoaded: true }))
    );
  }

  public setTranslations(strings: IStrings): void {
    strings = flattenStrings(strings);

    this.translateService.setTranslation(
      this.currentLanguage.code,
      strings,
      true
    );
  }

  public getI18nPath(
    module: string,
    languageCode = this.currentLanguage.code
  ): string {
    if (!this.i18nPath) throw new Error('i18nPath not set');

    return getI18nUrl(this.i18nPath, module, languageCode, this.requestType);
  }

  private getSavedUserLanguageOrDefault(): ILanguage {
    // Throw error if no languages are available
    if (this.languages.length === 0)
      throw new Error(
        'No Languages available. please add language to LANGUAGES array'
      );

    // Check if language is stored in local storage
    const savedLangInLocalStorage = localStorage.getItem(this.localStorageKey);
    if (savedLangInLocalStorage) {
      const language = this.getLanguage(savedLangInLocalStorage);
      if (language) return language;
    }

    // Get default application language
    const defaultAppLanguage = this.languages.find(
      (lang) => lang.code === this.defaultLanguage
    );
    if (defaultAppLanguage) return defaultAppLanguage;

    // Check if user language that stored in browser is supported
    const browserLanguage = this.translateService.getBrowserLang();
    if (browserLanguage) {
      const language = this.getLanguage(browserLanguage);
      if (language) return language;
    }

    // Return first language
    return this.languages[0];
  }

  private getLanguage(code: string): ILanguage | undefined {
    return this.languages.find((lang) => lang.code === code);
  }
}
