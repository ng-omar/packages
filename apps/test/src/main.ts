import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  // eslint-disable-next-line unicorn/prefer-top-level-await,no-console
  .catch((error) => console.error(error));
