import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ILanguage, IStrings } from '../../interfaces';
import { TranslationService } from '../../translation.service';

@Injectable()
export class StringsService {
  public constructor(
    private readonly http: HttpClient,
    private readonly translationService: TranslationService
  ) {
    if (!this.translationService.getTranslationEndPoint())
      throw new Error('translationEndPoint is not set');
  }

  public getLanguages(): ILanguage[] {
    return this.translationService.languages;
  }

  public getCurrentLanguage(): ILanguage {
    return this.translationService.currentLanguage;
  }

  public getModules(): Observable<string[]> {
    return this.http.get<string[]>(
      this.translationService.getTranslationEndPoint()
    );
  }

  public getStrings(
    module: string,
    languageCode: string
  ): Observable<IStrings> {
    const url = this.translationService.getTranslationEndPoint(
      module,
      languageCode
    );
    return this.http.get<IStrings>(url);
  }

  public updateStrings(
    module: string,
    languageCode: string,
    strings: IStrings
  ): Observable<IStrings> {
    const url = this.translationService.getTranslationEndPoint(
      module,
      languageCode
    );
    return this.http.put<IStrings>(url, { strings }).pipe(
      tap((value) => {
        if (languageCode === this.translationService.currentLanguage.code) {
          this.translationService.setTranslations(value);
        }
      })
    );
  }
}
