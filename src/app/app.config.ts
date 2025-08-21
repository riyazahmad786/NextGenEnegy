import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { DatePipe, PathLocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { routes } from './app.routes';
import { LoadingInterceptor } from './core/interceptor/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideAnimations(),
    BsDatepickerConfig,
    PathLocationStrategy,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
};
function importProvidersFrom(
  HighchartsChartModule: any
):
  | import('@angular/core').Provider
  | import('@angular/core').EnvironmentProviders {
  throw new Error('Function not implemented.');
}
