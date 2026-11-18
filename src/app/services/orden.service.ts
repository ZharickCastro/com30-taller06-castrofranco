import { Injectable, computed, signal } from '@angular/core';
import { EstadoOrden, NuevaOrden, Orden } from '../models/orden';
import { ORDENES_SEMILLA } from './ordenes-semilla';

@Injectable({ providedIn: 'root' })
export class OrdenService {
  private readonly _ordenes = signal<Orden[]>(ORDENES_SEMILLA);
  private siguienteId = ORDENES_SEMILLA.length + 1;

  readonly ordenes = this._ordenes.asReadonly();

  readonly total = computed(() => this._ordenes().length);

  readonly pendientes = computed(
    () => this._ordenes().filter((o) => o.estado === 'Pendiente').length,
  );

  /** Código visible en la URL: OM01, OM02, … */
  private static codigoDe(id: number): string {
    return 'OM' + String(id).padStart(2, '0');
  }

  /** Agrega la orden en estado Pendiente y devuelve su código. */
  agregar(datos: NuevaOrden): string {
    const id = this.siguienteId++;
    const orden: Orden = { ...datos, id, codigo: OrdenService.codigoDe(id), estado: 'Pendiente' };
    this._ordenes.update((lista) => [...lista, orden]);
    return orden.codigo;
  }

  cambiarEstado(id: number, estado: EstadoOrden) {
    this._ordenes.update((lista) => lista.map((o) => (o.id === id ? { ...o, estado } : o)));
  }

  eliminar(id: number) {
    this._ordenes.update((lista) => lista.filter((o) => o.id !== id));
  }
}
