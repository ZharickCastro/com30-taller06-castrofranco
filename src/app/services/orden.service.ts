import { Injectable, computed, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { EstadoOrden, NuevaOrden, Orden } from '../models/orden';
import { ORDENES_SEMILLA } from './ordenes-semilla';

/** Quita tildes y mayúsculas: «Pérez» -> «perez». */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

@Injectable({ providedIn: 'root' })
export class OrdenService {
  private readonly _ordenes = signal<Orden[]>(ORDENES_SEMILLA);
  private siguienteId = ORDENES_SEMILLA.length + 1;

  /** Cuántas consultas recibió buscar(); solo el servicio la modifica. */
  private readonly _llamadas = signal(0);

  readonly ordenes = this._ordenes.asReadonly();
  readonly llamadas = this._llamadas.asReadonly();

  readonly total = computed(() => this._ordenes().length);

  readonly pendientes = computed(
    () => this._ordenes().filter((o) => o.estado === 'Pendiente').length,
  );

  /** Código visible en la URL: OM01, OM02, … */
  private static codigoDe(id: number): string {
    return 'OM' + String(id).padStart(2, '0');
  }

  /** Retardo simulado: max(150, 1500 − 300 × longitud) ms. Más texto, respuesta más rápida. */
  static retardo(texto: string): number {
    return Math.max(150, 1500 - 300 * texto.length);
  }

  /**
   * Búsqueda simulada sin HttpClient. Regla: el texto, sin tildes ni mayúsculas y recortado,
   * está contenido en el equipo o en el técnico de la orden.
   */
  buscar(texto: string): Observable<Orden[]> {
    this._llamadas.update((n) => n + 1);
    const t = normalizar(texto.trim());
    const resultado = this._ordenes().filter(
      (o) => normalizar(o.equipo).includes(t) || normalizar(o.tecnico).includes(t),
    );
    return of(resultado).pipe(delay(OrdenService.retardo(t)));
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
