import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ESTADOS } from '../models/orden';
import { OrdenService } from '../services/orden.service';

@Component({
  selector: 'app-resumen-ordenes',
  imports: [CurrencyPipe],
  template: `
    <aside class="resumen">
      <h3>Resumen de órdenes</h3>
      <ul class="estados">
        @for (p of porEstado(); track p.estado) {
          <li>
            <span>{{ p.estado }}</span>
            <strong>{{ p.cantidad }}</strong>
          </li>
        }
      </ul>
      <p>Horas estimadas en total: <strong>{{ horasTotales() }}</strong></p>
      <p>
        Presupuesto total:
        <strong>{{ presupuestoTotal() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</strong>
      </p>
    </aside>
  `,
  styles: `
    .resumen { border: 1px solid #1e293b; border-radius: .6rem; padding: .9rem 1.1rem; background: #f1f5f9; margin-bottom: 1rem; }
    h3 { margin: 0 0 .5rem; font-size: 1rem; font-weight: 800; color: #0f172a; }
    .estados { list-style: none; display: flex; gap: .8rem; padding: 0; margin: 0 0 .5rem; flex-wrap: wrap; }
    .estados li { background: #fff; border-radius: .4rem; padding: .3rem .8rem; display: flex; gap: .5rem; align-items: baseline; }
    p { margin: .2rem 0; font-size: .9rem; color: #334155; }
  `,
})
export class ResumenOrdenes {
  private readonly servicio = inject(OrdenService);

  readonly porEstado = computed(() =>
    ESTADOS.map((estado) => ({
      estado,
      cantidad: this.servicio.ordenes().filter((o) => o.estado === estado).length,
    })),
  );

  readonly horasTotales = computed(() =>
    this.servicio
      .ordenes()
      .reduce((suma, o) => suma + o.tareas.reduce((horas, t) => horas + t.horas, 0), 0),
  );

  readonly presupuestoTotal = computed(() =>
    this.servicio.ordenes().reduce((suma, o) => suma + o.presupuesto, 0),
  );
}
