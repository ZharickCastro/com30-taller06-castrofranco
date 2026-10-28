import { Injectable, computed, signal } from '@angular/core';
import { EstadoOrden, NuevaOrden, Orden } from '../models/orden';

@Injectable({ providedIn: 'root' })
export class OrdenService {
  private readonly _ordenes = signal<Orden[]>([]);
  private siguienteId = 1;

  readonly ordenes = this._ordenes.asReadonly();

  readonly total = computed(() => this._ordenes().length);

  readonly pendientes = computed(
    () => this._ordenes().filter((o) => o.estado === 'Pendiente').length,
  );

  agregar(datos: NuevaOrden) {
    const orden: Orden = { ...datos, id: this.siguienteId++, estado: 'Pendiente' };
    this._ordenes.update((lista) => [...lista, orden]);
  }

  cambiarEstado(id: number, estado: EstadoOrden) {
    this._ordenes.update((lista) => lista.map((o) => (o.id === id ? { ...o, estado } : o)));
  }

  eliminar(id: number) {
    this._ordenes.update((lista) => lista.filter((o) => o.id !== id));
  }
}
