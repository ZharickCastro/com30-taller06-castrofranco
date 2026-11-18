import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

// Vista 404: la atiende el comodín '**' cuando ninguna ruta coincide con la dirección.
@Component({
  selector: 'app-no-encontrada',
  imports: [RouterLink],
  template: `
    <section class="caja">
      <p class="numero">404</p>
      <p>La dirección <b class="ruta">{{ url }}</b> no existe en esta aplicación.</p>
      <a routerLink="/ordenes" class="volver">Volver al listado de órdenes</a>
    </section>
  `,
  styles: `
    .caja { border-radius: .8rem; background: #fee2e2; color: #991b1b; padding: 1.4rem; }
    .numero { font-size: 2.5rem; font-weight: 900; margin: 0; }
    .ruta { font-family: ui-monospace, Consolas, monospace; }
    .volver { display: inline-block; margin-top: .6rem; font-weight: 700; color: #991b1b; }
  `,
})
export class NoEncontrada {
  readonly url = inject(Router).url;
}
