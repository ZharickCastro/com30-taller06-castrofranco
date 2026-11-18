import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrdenService } from '../services/orden.service';

// Detalle /ordenes/:id. El parámetro :id llega al input() del mismo nombre
// (withComponentInputBinding) y un computed busca la orden en el servicio.
// Un código inexistente NO es un 404: la ruta existe, lo que falta es el registro.
@Component({
  selector: 'app-detalle-orden',
  imports: [CurrencyPipe, RouterLink],
  template: `
    @if (orden(); as o) {
      <article class="ficha">
        <p class="codigo">{{ o.codigo }} · {{ o.tipo }}</p>
        <h2>{{ o.equipo }}</h2>
        <span class="estado" [attr.data-estado]="o.estado">{{ o.estado }}</span>
        <dl>
          <dt>Técnico</dt><dd>{{ o.tecnico }} ({{ o.correoTecnico }})</dd>
          <dt>Fechas</dt><dd>Del {{ o.fechaInicio }} al {{ o.fechaFin }}</dd>
          <dt>Presupuesto</dt><dd>{{ o.presupuesto | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</dd>
        </dl>
        <h3>Tareas</h3>
        <ul>
          @for (t of o.tareas; track $index) {
            <li>{{ t.descripcion }} · {{ t.horas }} h</li>
          }
        </ul>
        <a routerLink="/ordenes" class="volver">Volver al listado</a>
      </article>
    } @else {
      <div class="no-existe">
        No existe la orden {{ id() }}.
        <a routerLink="/ordenes">Volver al listado</a>
      </div>
    }
  `,
  styles: `
    .ficha { border: 1px solid #cbd5e1; border-radius: .8rem; background: #fff; padding: 1.2rem; }
    .codigo { margin: 0; font-family: ui-monospace, Consolas, monospace; font-size: .8rem; color: #64748b; }
    h2 { margin: .2rem 0 .5rem; font-size: 1.4rem; font-weight: 800; color: #0f172a; }
    h3 { margin: 1rem 0 .3rem; font-size: 1rem; color: #0f172a; }
    .estado { display: inline-block; border-radius: 9999px; padding: .15rem .7rem; font-size: .8rem; font-weight: 700; background: #fef3c7; color: #92400e; }
    .estado[data-estado='En curso'] { background: #dbeafe; color: #1e40af; }
    .estado[data-estado='Terminada'] { background: #dcfce7; color: #166534; }
    dl { display: grid; grid-template-columns: 8rem 1fr; gap: .3rem .8rem; margin: 1rem 0 0; font-size: .9rem; }
    dt { font-weight: 700; color: #334155; }
    dd { margin: 0; color: #475569; }
    ul { margin: 0; padding-left: 1.2rem; font-size: .9rem; color: #475569; }
    .volver { display: inline-block; margin-top: 1rem; font-weight: 700; color: #1e293b; }
    .no-existe { border-radius: .8rem; background: #fef3c7; color: #92400e; padding: 1.2rem; font-weight: 600; }
    .no-existe a { margin-left: .4rem; color: #92400e; }
  `,
})
export class DetalleOrden {
  private readonly servicio = inject(OrdenService);

  /** :id de la ruta, siempre texto (OM05). */
  readonly id = input.required<string>();

  readonly orden = computed(() =>
    this.servicio.ordenes().find((o) => o.codigo === this.id().toUpperCase()),
  );
}
