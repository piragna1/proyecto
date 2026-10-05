import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { servidorCaidoInterceptor } from './interceptors/servidor-caido.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes), provideAnimations(), 
    provideHttpClient(
      withInterceptors([
        tokenInterceptor,
        // Despues del de token: asi recibe los errores antes y no se pisa con el
        // cierre de sesion del 401.
        servidorCaidoInterceptor
      ])
    )
  ],
};
