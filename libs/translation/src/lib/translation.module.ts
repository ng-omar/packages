import { Inject, ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslationService } from './translation.service';
import { ILanguage, ILanguageConfig, IStrings } from './interfaces';
import { RequestType } from './types';
import {
  DEFAULT_LANGUAGE_TOKEN,
  I18N_PATH_TOKEN,
  IS_ROOT_TOKEN,
  LANGUAGES_TOKEN,
  LOCAL_STORAGE_KEY_TOKEN,
  MODULE_TOKEN,
  REQUEST_TYPE_TOKEN,
  STRINGS_TOKEN,
} from './config';
import { StringsComponent } from './components/strings/strings.component';

@NgModule({
  declarations: [StringsComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [TranslateModule, StringsComponent],
})
export class TranslationModule {
  public static isInitialized = false;

  public constructor(
    private readonly translationService: TranslationService,
    @Inject(LANGUAGES_TOKEN) languages: ILanguage[],
    @Inject(IS_ROOT_TOKEN) isRoot: boolean,
    @Inject(LOCAL_STORAGE_KEY_TOKEN) localStorageKey?: string,
    @Inject(DEFAULT_LANGUAGE_TOKEN) defaultLanguage?: string,
    @Inject(I18N_PATH_TOKEN) i18nPath?: string,
    @Inject(REQUEST_TYPE_TOKEN) requestType?: RequestType,
    @Inject(MODULE_TOKEN) module?: string,
    @Inject(STRINGS_TOKEN) strings?: IStrings
  ) {
    if (isRoot && TranslationModule.isInitialized) {
      throw new Error('You cannot use forRoot multiple times');
    }

    if (!isRoot && !TranslationModule.isInitialized) {
      throw new Error('You cannot use forChild before forRoot');
    }

    TranslationModule.isInitialized = true;

    if (isRoot)
      this.translationService.init(
        languages,
        defaultLanguage,
        i18nPath,
        requestType,
        localStorageKey,
        module,
        strings
      );

    if (!isRoot && i18nPath && module)
      this.translationService.loadStringsFromModule(module).subscribe();

    if (!isRoot && strings) this.translationService.setTranslations(strings);
  }

  public static forRoot(
    config: ILanguageConfig
  ): ModuleWithProviders<TranslationModule> {
    return {
      ngModule: TranslationModule,
      providers: [
        { provide: LANGUAGES_TOKEN, useValue: config.languages },
        { provide: DEFAULT_LANGUAGE_TOKEN, useValue: config.defaultLanguage },
        { provide: I18N_PATH_TOKEN, useValue: config.i18nPath },
        { provide: REQUEST_TYPE_TOKEN, useValue: config.requestType },
        { provide: LOCAL_STORAGE_KEY_TOKEN, useValue: config.localStorageKey },
        { provide: MODULE_TOKEN, useValue: config.module },
        { provide: STRINGS_TOKEN, useValue: config.strings },
        { provide: IS_ROOT_TOKEN, useValue: true },
        TranslationService,
      ],
    };
  }

  public static forChild(
    config?: Pick<ILanguageConfig, 'module' | 'strings'>
  ): ModuleWithProviders<TranslationModule> {
    return {
      ngModule: TranslationModule,
      providers: [
        { provide: MODULE_TOKEN, useValue: config?.module },
        { provide: STRINGS_TOKEN, useValue: config?.strings },
        { provide: IS_ROOT_TOKEN, useValue: false },
      ],
    };
  }
}
