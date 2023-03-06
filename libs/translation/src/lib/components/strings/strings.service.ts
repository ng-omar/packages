import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ILanguage, IStrings } from '../../interfaces';
import { TranslationService } from '../../translation.service';

@Injectable()
export class StringsService {
  private readonly i18nPath!: string;

  public constructor(
    private readonly http: HttpClient,
    private readonly translationService: TranslationService
  ) {
    if (!translationService.i18nPath) throw new Error('i18nPath not set');
    if (translationService.requestType !== 'http')
      throw new Error(
        'you must set requestType to http in order to use this service'
      );
    this.i18nPath = translationService.i18nPath;
  }

  public getLanguages(): ILanguage[] {
    return this.translationService.languages;
  }

  public getCurrentLanguage(): ILanguage {
    return this.translationService.currentLanguage;
  }

  public getModules(): Observable<string[]> {
    return this.http.get<string[]>(`${this.i18nPath}/modules`);
  }

  public getStrings(
    module: string,
    languageCode: string
  ): Observable<IStrings> {
    const url = this.translationService.getI18nPath(module, languageCode);
    return this.http.get<IStrings>(url);
  }

  public updateStrings(
    module: string,
    languageCode: string,
    strings: IStrings
  ): Observable<IStrings> {
    const url = this.translationService.getI18nPath(module, languageCode);
    return this.http.put<IStrings>(url, { strings }).pipe(
      tap((value) => {
        if (languageCode === this.translationService.currentLanguage.code) {
          this.translationService.setTranslations(value);
        }
      })
    );
  }
}
