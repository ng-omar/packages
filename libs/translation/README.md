# NG Omar Translation

NG Omar Translation Library

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install @ng-omar/translation

```bash
npm i --save @ng-omar/translation @ngx-translate/core date-fns ngx-date-fns
```

app.module.ts

```typescript
import { NgModule } from '@angular/core';
import { DateFnsModule } from 'ngx-date-fns';
import { TranslationModule } from '@ng-omar/translation';
import { TranslateModule } from '@ngx-translate/core';
import { arEG, enUS } from 'date-fns/locale';
import { arStrings } from '../i18n/ar';
import { enStrings } from '../i18n/en';

@NgModule({
  imports: [
    DateFnsModule.forRoot(),
    TranslateModule.forRoot(),
    TranslationModule.forRoot({
      languages: [
        { code: 'ar', label: 'Arabic', dir: 'rtl', dateFnsLocale: arEG },
        { code: 'en', label: 'English', dir: 'ltr', dateFnsLocale: enUS },
      ],
      defaultLanguage: 'ar',
      i18nFolderPath: './assets/i18n',
      translationEndpoint: `${environment.backendUrl}/api/v1/translations`,
      module: 'default',
      strings: [arStrings, enStrings],
    }),
  ],
})
export class AppModule {}
```

lazy.module.ts

```typescript
import { NgModule } from '@angular/core';
import { TranslationModule } from '@ng-omar/translation';
import { arStrings } from '../i18n/ar';
import { enStrings } from '../i18n/en';

@NgModule({
  imports: [
    TranslationModule.forChild({
      module: 'strings',
      strings: [arStrings, enStrings],
    }),
  ],
})
export class LazyModule {}
```

## Development

To run this project in development use

Clone the project

```bash
  git clone https://github.com/ng-omar/packages.git
```

Install Packages

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Authors

- [@omar-elsayed](https://github.com/omar-elsayed97)

## Hi, I'm Omar Elsayed! 👋

I'm a full stack javascript developer...

## 🛠 Skills

Typescript, Javascript, Angular, Ionic, Nest.js, Node.js, HTML, CSS...

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Feedback

If you have any feedback, please reach out to us at challengeromar97@gmail.com
