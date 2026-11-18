import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ESTADOS, EstadoOrden } from '../models/orden';
import { OrdenService } from '../services/orden.service';

// Listado /ordenes con filtro en la URL: /ordenes?estado=Pendiente.
// El filtro vive en la dirección, no en memoria: F5 lo conserva y la URL se puede compartir.
@Component({
  selector: 'app-listado-ordenes',
  imports: [CurrencyPipe, RouterLink],
  template: `
    <section class="listado">
      <div class="cabecera">
        <h2>Órdenes registradas</h2>
        <p class="contador">
          Total: <strong>{{ servicio.total() }}</strong> · Pendientes:
          <strong>{{ servicio.pendientes() }}</strong>
        </p>
      </div>

      <nav class="filtros">
        <span>Estado:</span>
        <a routerLink="." [queryParams]="{}" [class.sel]="!estado()">Todas</a>
        @for (e of estados; track e) {
          <a routerLink="." [queryParams]="{ estado: e }" [class.sel]="estado() === e">{{ e }}</a>
        }
      </nav>

      <p class="mostrando">
        Mostrando <strong>{{ visibles().length }}</strong> orden(es)
        @if (estado()) { con estado «{{ estado() }}» }
      </p>

      <ul class="ordenes">
        @for (o of visibles(); track o.id) {
          <li class="orden">
            <a class="datos" [routerLink]="[o.codigo]">
              <span class="codigo">{{ o.codigo }}</span>
              <h3>{{ o.equipo }} · {{ o.tipo }}</h3>
              <p>Técnico: {{ o.tecnico }}</p>
              <p>Del {{ o.fechaInicio }} al {{ o.fechaFin }} · {{ o.tareas.length }} tarea(s)</p>
              <p>Presupuesto: {{ o.presupuesto | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
            </a>
            <div class="acciones">
              <select (change)="cambiarEstado(o.id, $event)" [attr.aria-label]="'Estado de ' + o.codigo">
                @for (e of estados; track e) {
                  <option [value]="e" [selected]="e === o.estado">{{ e }}</option>
                }
              </select>
              <button type="button" class="eliminar" (click)="servicio.eliminar(o.id)">Eliminar</button>
            </div>
          </li>
        } @empty {
          <li class="vacio">
            @if (estado()) {
              No hay órdenes con el estado «{{ estado() }}».
            } @else {
              No hay órdenes registradas.
            }
          </li>
        }
      </ul>
    </section>
  `,
  styles: `
    .listado { display: flex; flex-direction: column; gap: 1rem; }
    .cabecera { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: .5rem; }
    h2 { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0; }
    .contador, .mostrando { margin: 0; color: #475569; font-size: .9rem; }
    .filtros { display: flex; flex-wrap: wrap; align-items: center; gap: .4rem; font-size: .85rem; }
    .filtros span { font-weight: 700; color: #334155; }
    .filtros a { border: 1px solid #cbd5e1; border-radius: .5rem; padding: .25rem .8rem; color: #334155; text-decoration: none; background: #fff; }
    .filtros a.sel { background: #d97706; border-color: #d97706; color: #fff; font-weight: 700; }
    .ordenes { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: .7rem; }
    .orden { display: flex; justify-content: space-between; gap: 1rem; border: 1px solid #cbd5e1; border-radius: .6rem; padding: .8rem 1rem; background: #fff; }
    .orden:hover { border-color: #1e293b; }
    .datos { flex: 1; color: inherit; text-decoration: none; }
    .codigo { font-family: ui-monospace, Consolas, monospace; font-size: .75rem; color: #64748b; }
    .datos h3 { margin: 0 0 .2rem; font-size: 1rem; font-weight: 800; color: #0f172a; }
    .datos p { margin: .1rem 0; font-size: .85rem; color: #475569; }
    .acciones { display: flex; flex-direction: column; gap: .5rem; align-items: flex-end; }
    select { border: 1px solid #94a3b8; border-radius: .4rem; padding: .3rem .5rem; font-size: .85rem; }
    .eliminar { border-radius: .4rem; background: #991b1b; color: #fff; padding: .3rem .8rem; font-size: .8rem; font-weight: 700; }
    .vacio { text-align: center; color: #92400e; background: #fef3c7; padding: 1.5rem; border-radius: .6rem; }
  `,
})
export class ListadoOrdenes {
  protected readonly servicio = inject(OrdenService);

  protected readonly estados = ESTADOS;

  /** ?estado=… de la URL; undefined cuando no viene. */
  readonly estado = input<string>();

  readonly visibles = computed(() => {
    const e = this.estado();
    const todas = this.servicio.ordenes();
    return e ? todas.filter((o) => o.estado === e) : todas;
  });

  cambiarEstado(id: number, evento: Event) {
    const estado = (evento.target as HTMLSelectElement).value as EstadoOrden;
    this.servicio.cambiarEstado(id, estado);
  }
}
