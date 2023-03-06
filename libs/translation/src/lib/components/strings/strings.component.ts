import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StringsService } from './strings.service';
import { IGroupedStrings, ILanguage, IStrings } from '../../interfaces';

@Component({
  selector: 'translation-strings',
  templateUrl: './strings.component.html',
  styleUrls: ['./strings.component.scss'],
  providers: [StringsService],
})
export class StringsComponent {
  public languages: ILanguage[] = [];

  public selectedLanguage!: ILanguage;

  public modules: string[] = [];

  public selectedModule?: string;

  public groupedStrings?: IGroupedStrings;

  public formGroup: FormGroup = this.fb.group({});

  public constructor(
    private readonly fb: FormBuilder,
    private readonly stringsService: StringsService
  ) {
    this.languages = stringsService.getLanguages();
    this.selectedLanguage = stringsService.getCurrentLanguage();

    stringsService.getModules().subscribe((modules) => {
      this.modules = modules;
      this.onChangeModule(modules?.[0]);
    });
  }

  public onChangeLanguage(language: ILanguage): void {
    this.selectedLanguage = language;
    this.refreshStrings();
  }

  public onChangeModule(module: string): void {
    this.selectedModule = module;
    this.refreshStrings();
  }

  public onClickSubmit(): void {
    if (this.formGroup.invalid || !this.selectedModule) return;

    const strings: IStrings = this.formGroup.value as IStrings;

    if (strings['default']) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(strings['default'])) {
        strings[key] = value;
      }

      delete strings['default'];
    }

    this.stringsService
      .updateStrings(this.selectedModule, this.selectedLanguage.code, strings)
      .subscribe();
  }

  private refreshStrings(): void {
    this.groupedStrings = {};
    if (!this.selectedModule || !this.selectedLanguage) return;

    this.stringsService
      .getStrings(this.selectedModule, this.selectedLanguage.code)
      .subscribe((strings) => {
        const result: IGroupedStrings = { default: {} };

        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of Object.entries(strings)) {
          if (typeof value === 'string') result['default'][key] = value;
          else result[key] = value;
        }

        this.groupedStrings = result;
        this.initializeFormGroup(result);
      });
  }

  private initializeFormGroup(result: IGroupedStrings): void {
    this.formGroup = this.fb.group({});

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(result)) {
      const group = this.fb.group({});

      // eslint-disable-next-line no-restricted-syntax
      for (const [key2, value2] of Object.entries(value)) {
        group.addControl(
          key2,
          this.fb.control(value2, {
            validators: [Validators.required.bind(Validators)],
          })
        );
      }

      this.formGroup.addControl(key, group);
    }
  }
}
