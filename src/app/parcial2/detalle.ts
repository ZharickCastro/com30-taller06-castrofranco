import { Component, computed, input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';
import { M, PATRON_CODIGO, TOPE } from './parametros';

// Ruta /parcial2/detalle/:codigo?cantidad=n
// withComponentInputBinding entrega el parámetro de ruta :codigo y el
// parámetro de consulta ?cantidad= como inputs. La URL siempre trae texto,
// por eso cantidad usa numberAttribute: convierte "8" en el número 8.
@Component({
  selector: 'app-parcial2-detalle',
  imports: [RouterLink],
  template: `
    <section class="detalle">
      <h1>Detalle de la solicitud</h1>
      @if (codigoValido()) {
        <dl>
          <dt>Código</dt>
          <dd>{{ codigo() }}</dd>
          <dt>Cantidad</dt>
          <dd>{{ cantidad() }}</dd>
          <dt>Bloques</dt>
          <dd>{{ bloques() }}</dd>
          <dt>Margen</dt>
          <dd>{{ margen() }}</dd>
        </dl>
      } @else {
        <p class="aviso">Código inválido: «{{ codigo() }}»</p>
      }
      <a routerLink="/parcial2">← Volver a la solicitud</a>
    </section>
  `,
  styles: `
    .detalle { display: block; max-width: 24rem; }
    h1 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem; }
    dl { display: grid; grid-template-columns: auto 1fr; gap: .4rem 1rem; margin-bottom: 1rem; }
    dt { font-weight: 700; color: #475569; }
    dd { color: #0f172a; }
    .aviso { background: #fee2e2; color: #991b1b; border-radius: .4rem; padding: .6rem .8rem; font-weight: 700; margin-bottom: 1rem; }
    a { color: #1d4ed8; font-size: .85rem; }
  `,
})
export class Parcial2Detalle {
  codigo = input.required<string>();
  cantidad = input(0, { transform: numberAttribute });

  codigoValido = computed(() => PATRON_CODIGO.test(this.codigo()));
  bloques = computed(() => this.cantidad() / M);
  margen = computed(() => TOPE - this.cantidad());
}
