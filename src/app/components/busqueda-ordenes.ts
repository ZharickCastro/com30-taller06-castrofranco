import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize, map, of, share, switchMap, tap } from 'rxjs';
import { Orden } from '../models/orden';
import { OrdenService } from '../services/orden.service';

// Búsqueda reactiva /busqueda. Tubería:
//   valueChanges -> map(trim) -> debounceTime(300) -> distinctUntilChanged -> switchMap(servicio)
// map(trim): «perez » y «perez» son el mismo texto.
// debounceTime(300): espera 300 ms sin escribir; no se consulta en cada pulsación.
// distinctUntilChanged: si el texto recortado no cambió, no hay consulta nueva.
// switchMap: cancela la consulta anterior; solo se muestra la respuesta de la última.
@Component({
  selector: 'app-busqueda-ordenes',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="busqueda">
      <div class="cabecera">
        <h2>Buscar órdenes</h2>
        <p class="contador">Llamadas al servicio: <strong data-testid="llamadas">{{ servicio.llamadas() }}</strong></p>
      </div>

      <label for="busqueda">Equipo o técnico</label>
      <input id="busqueda" type="search" [formControl]="busqueda" placeholder="Ej.: compresor, pérez…" autocomplete="off" />

      @if (buscando()) {
        <p class="aviso buscando">Buscando…</p>
      } @else if (termino().length === 1) {
        <p class="aviso minimo">Escriba al menos 2 caracteres para buscar.</p>
      }

      @if (termino().length >= 2 && !buscando()) {
        <ul class="resultados">
          @for (o of registros(); track o.id) {
            <li>
              <a [routerLink]="['/ordenes', o.codigo]">
                <span class="codigo">{{ o.codigo }}</span>
                <b>{{ o.equipo }}</b>
                <span>{{ o.tecnico }}</span>
                <span class="estado" [attr.data-estado]="o.estado">{{ o.estado }}</span>
              </a>
            </li>
          } @empty {
            <li class="vacio">Sin coincidencias para «{{ termino() }}».</li>
          }
        </ul>
      }
    </section>
  `,
  styles: `
    .busqueda { display: flex; flex-direction: column; gap: .8rem; }
    .cabecera { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: .5rem; }
    h2 { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0; }
    .contador { margin: 0; color: #475569; font-size: .9rem; }
    label { font-size: .8rem; font-weight: 700; color: #334155; }
    input { border: 1px solid #94a3b8; border-radius: .5rem; padding: .55rem .8rem; font-size: 1rem; background: #fff; }
    .aviso { margin: 0; border-radius: .5rem; padding: .5rem .8rem; font-size: .9rem; font-weight: 600; }
    .buscando { background: #dbeafe; color: #1e40af; }
    .minimo { background: #fef3c7; color: #92400e; }
    .resultados { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: .5rem; }
    .resultados a { display: grid; grid-template-columns: 4rem 1fr 9rem 6rem; gap: .6rem; align-items: center; border: 1px solid #cbd5e1; border-radius: .5rem; background: #fff; padding: .55rem .8rem; color: #0f172a; text-decoration: none; font-size: .9rem; }
    .resultados a:hover { border-color: #1e293b; }
    .codigo { font-family: ui-monospace, Consolas, monospace; font-size: .8rem; color: #64748b; }
    .estado { justify-self: start; border-radius: 9999px; padding: .1rem .6rem; font-size: .75rem; font-weight: 700; background: #fef3c7; color: #92400e; }
    .estado[data-estado='En curso'] { background: #dbeafe; color: #1e40af; }
    .estado[data-estado='Terminada'] { background: #dcfce7; color: #166534; }
    .vacio { text-align: center; color: #92400e; background: #fef3c7; padding: 1.2rem; border-radius: .5rem; }
  `,
})
export class BusquedaOrdenes {
  protected readonly servicio = inject(OrdenService);

  readonly busqueda = new FormControl('', { nonNullable: true });

  /** Texto recortado que llegó a la consulta (después de debounce y distinct). */
  readonly termino = signal('');
  readonly buscando = signal(false);

  /** Texto ya estabilizado; share() para que resultado e historial usen el mismo flujo. */
  private readonly termino$ = this.busqueda.valueChanges.pipe(
    map((t) => t.trim()),
    debounceTime(300),
    distinctUntilChanged(),
    tap((t) => this.termino.set(t)),
    share(),
  );

  private readonly resultado$ = this.termino$.pipe(
    switchMap((t) => {
      if (t.length < 2) {
        this.buscando.set(false);
        return of([] as Orden[]); // menos de 2 caracteres: no se consulta
      }
      this.buscando.set(true);
      return this.servicio.buscar(t).pipe(finalize(() => this.buscando.set(false)));
    }),
  );

  /** Resultado de la última consulta, como signal; vacío hasta la primera respuesta. */
  readonly registros = toSignal(this.resultado$, { initialValue: [] as Orden[] });
}
