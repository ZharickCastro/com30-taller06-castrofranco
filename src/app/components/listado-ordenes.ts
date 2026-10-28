import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ESTADOS, EstadoOrden } from '../models/orden';
import { OrdenService } from '../services/orden.service';
import { ResumenOrdenes } from './resumen-ordenes';

@Component({
  selector: 'app-listado-ordenes',
  imports: [CurrencyPipe, ResumenOrdenes],
  template: `
    <section class="listado">
      <div class="cabecera">
        <h2>Órdenes registradas</h2>
        <p class="contador">
          Total: <strong>{{ servicio.total() }}</strong> · Pendientes:
          <strong>{{ servicio.pendientes() }}</strong>
        </p>
      </div>

      @defer (on interaction) {
        <app-resumen-ordenes />
      } @placeholder {
        <button type="button" class="secundario">Ver resumen</button>
      }

      <ul class="ordenes">
        @for (o of servicio.ordenes(); track o.id) {
          <li class="orden">
            <div class="datos">
              <h3>{{ o.equipo }} · {{ o.tipo }}</h3>
              <p>Técnico: {{ o.tecnico }} ({{ o.correoTecnico }})</p>
              <p>Del {{ o.fechaInicio }} al {{ o.fechaFin }} · {{ o.tareas.length }} tarea(s)</p>
              <p>Presupuesto: {{ o.presupuesto | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
            </div>
            <div class="acciones">
              <select [value]="o.estado" (change)="cambiarEstado(o.id, $event)" [attr.aria-label]="'Estado de ' + o.equipo">
                @for (e of estados; track e) {
                  <option [value]="e" [selected]="e === o.estado">{{ e }}</option>
                }
              </select>
              <button type="button" class="eliminar" (click)="servicio.eliminar(o.id)">Eliminar</button>
            </div>
          </li>
        } @empty {
          <li class="vacio">No hay órdenes registradas</li>
        }
      </ul>
    </section>
  `,
  styles: `
    .listado { display: flex; flex-direction: column; gap: 1rem; }
    .cabecera { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: .5rem; }
    h2 { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0; }
    .contador { margin: 0; color: #475569; font-size: .9rem; }
    .secundario { align-self: flex-start; border: 1px solid #1e293b; border-radius: .4rem; background: #fff; color: #1e293b; padding: .4rem .9rem; font-size: .85rem; font-weight: 700; }
    .ordenes { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: .7rem; }
    .orden { display: flex; justify-content: space-between; gap: 1rem; border: 1px solid #cbd5e1; border-radius: .6rem; padding: .8rem 1rem; background: #fff; }
    .datos h3 { margin: 0 0 .2rem; font-size: 1rem; font-weight: 800; color: #0f172a; }
    .datos p { margin: .1rem 0; font-size: .85rem; color: #475569; }
    .acciones { display: flex; flex-direction: column; gap: .5rem; align-items: flex-end; }
    select { border: 1px solid #94a3b8; border-radius: .4rem; padding: .3rem .5rem; font-size: .85rem; }
    .eliminar { border-radius: .4rem; background: #991b1b; color: #fff; padding: .3rem .8rem; font-size: .8rem; font-weight: 700; }
    .vacio { text-align: center; color: #64748b; padding: 1.5rem; border: 1px dashed #cbd5e1; border-radius: .6rem; }
  `,
})
export class ListadoOrdenes {
  protected readonly servicio = inject(OrdenService);

  protected readonly estados = ESTADOS;

  cambiarEstado(id: number, evento: Event) {
    const estado = (evento.target as HTMLSelectElement).value as EstadoOrden;
    this.servicio.cambiarEstado(id, estado);
  }
}
