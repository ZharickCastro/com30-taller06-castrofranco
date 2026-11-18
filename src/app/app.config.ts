import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import localeEsCo from '@angular/common/locales/es-CO';
import { routes } from './app.routes';

registerLocaleData(localeEsCo);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withComponentInputBinding: los parámetros de ruta (:id) y de consulta (?estado=)
    // llegan a los input() del componente con el mismo nombre.
    provideRouter(routes, withComponentInputBinding()),
    { provide: LOCALE_ID, useValue: 'es-CO' },
  ],
};
