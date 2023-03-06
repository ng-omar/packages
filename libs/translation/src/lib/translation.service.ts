import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { catchError, map, Observable, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { DateFnsConfigurationService } from 'ngx-date-fns';
import { ILanguage, IStrings } from './interfaces';
import { flattenStrings } from './utils';

@Injectable()
export class TranslationService {
  public languages: ILanguage[] = [];

  private localStorageKey!: string;

  private defaultLanguage?: string;

  private i18nFolderPath?: string;

  private translationEndPoint?: string;

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
    localStorageKey = 'selected-language',
    i18nFolderPath?: string,
    translationEndPoint?: string
  ): void {
    this.languages = languages;
    this.defaultLanguage = defaultLanguage;
    this.localStorageKey = localStorageKey;
    this.i18nFolderPath = i18nFolderPath;
    this.translationEndPoint = translationEndPoint;

    const selectedLanguage = this.getSavedUserLanguageOrDefault();

    const renderer = this.rendererFactory.createRenderer(null, null);
    this.setLanguage(selectedLanguage, renderer);
    this.translateService.addLangs(this.languages.map((l) => l.code));
    if (defaultLanguage) this.translateService.setDefaultLang(defaultLanguage);
    this.translateService.use(selectedLanguage.code);

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

  public setTranslations(strings: IStrings): void {
    strings = flattenStrings(strings);

    this.translateService.setTranslation(
      this.currentLanguage.code,
      strings,
      true
    );
  }

  public getI18nFolderPath(
    module: string,
    languageCode = this.currentLanguage.code
  ): string {
    if (!this.i18nFolderPath) throw new Error('Please set i18nFolderPath');
    return `${this.i18nFolderPath}/${module}/${languageCode}.json`;
  }

  public getTranslationEndPoint(
    module?: string,
    languageCode = this.currentLanguage.code
  ): string {
    if (!this.translationEndPoint)
      throw new Error('Please set translationEndPoint');
    const endPoint = module ? `/${module}/${languageCode}` : '';

    return `${this.translationEndPoint}/modules${endPoint}`;
  }

  public loadStringsFromModule(module: string): Observable<{ isLoaded: true }> {
    if (this.i18nFolderPath && this.translationEndPoint) {
      return this.loadTranslation(module, 'json').pipe(
        catchError(() => this.loadTranslation(module, 'http')),
        switchMap(() => this.loadTranslation(module, 'http'))
      );
    }

    if (this.i18nFolderPath) return this.loadTranslation(module, 'json');
    if (this.translationEndPoint) return this.loadTranslation(module, 'http');

    throw new Error('Please set i18nFolderPath or translationEndPoint');
  }

  private loadTranslation(
    module: string,
    type: 'json' | 'http'
  ): Observable<{ isLoaded: true }> {
    const url =
      type === 'json'
        ? this.getI18nFolderPath(module)
        : this.getTranslationEndPoint(module);

    return this.http.get<IStrings>(url).pipe(
      tap((strings) => this.setTranslations(strings)),
      map(() => ({ isLoaded: true }))
    );
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
