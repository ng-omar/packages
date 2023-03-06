import { Inject, ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslationService } from './translation.service';
import { ILanguage, ITranslationConfig, IStrings } from './interfaces';
import {
  IS_ROOT_TOKEN,
  LANGUAGES_TOKEN,
  DEFAULT_LANGUAGE_TOKEN,
  LOCAL_STORAGE_KEY_TOKEN,
  I18N_FOLDER_PATH_TOKEN,
  TRANSLATION_END_POINT_TOKEN,
  STRINGS_TOKEN,
  MODULE_TOKEN,
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
    @Inject(IS_ROOT_TOKEN) isRoot: boolean,
    @Inject(LANGUAGES_TOKEN) languages: ILanguage[],
    @Inject(DEFAULT_LANGUAGE_TOKEN) defaultLanguage?: string,
    @Inject(LOCAL_STORAGE_KEY_TOKEN) localStorageKey?: string,
    @Inject(I18N_FOLDER_PATH_TOKEN) i18nFolderPath?: string,
    @Inject(TRANSLATION_END_POINT_TOKEN) translationEndPoint?: string,
    @Inject(STRINGS_TOKEN) strings?: IStrings,
    @Inject(MODULE_TOKEN) module?: string
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
        localStorageKey,
        i18nFolderPath,
        translationEndPoint
      );

    if ((translationEndPoint || i18nFolderPath) && module)
      this.translationService.loadStringsFromModule(module).subscribe();

    if (strings) this.translationService.setTranslations(strings);
  }

  public static forRoot(
    config: ITranslationConfig
  ): ModuleWithProviders<TranslationModule> {
    return {
      ngModule: TranslationModule,
      providers: [
        { provide: IS_ROOT_TOKEN, useValue: true },
        { provide: LANGUAGES_TOKEN, useValue: config.languages },
        { provide: DEFAULT_LANGUAGE_TOKEN, useValue: config.defaultLanguage },
        { provide: LOCAL_STORAGE_KEY_TOKEN, useValue: config.localStorageKey },
        { provide: I18N_FOLDER_PATH_TOKEN, useValue: config.i18nFolderPath },
        {
          provide: TRANSLATION_END_POINT_TOKEN,
          useValue: config.translationEndpoint,
        },
        { provide: STRINGS_TOKEN, useValue: config.strings },
        { provide: MODULE_TOKEN, useValue: config.module },
        TranslationService,
      ],
    };
  }

  public static forChild(
    config?: Pick<ITranslationConfig, 'module' | 'strings'>
  ): ModuleWithProviders<TranslationModule> {
    return {
      ngModule: TranslationModule,
      providers: [
        { provide: IS_ROOT_TOKEN, useValue: false },
        { provide: MODULE_TOKEN, useValue: config?.module },
        { provide: STRINGS_TOKEN, useValue: config?.strings },
      ],
    };
  }
}
