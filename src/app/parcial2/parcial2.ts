import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { OrdenService, normalizar } from '../services/orden.service';
import { AbstractControl, FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DESDE, M, PATRON_CODIGO, TOPE } from './parametros';
import { hastaMayor, multiplo, rango } from './validadores';

@Component({
  selector: 'app-parcial2',
  imports: [ReactiveFormsModule],
  template: `
    <section class="parcial">
      <h1>Parcial 2 · Solicitud</h1>
      <p class="params">m = {{ m }} · tope = {{ tope }}</p>

      <div class="buscar">
        <label>
          Buscar
          <input [formControl]="buscar" placeholder="Equipo o técnico" autocomplete="off" />
        </label>
        <p>Último valor: «{{ ultimo() }}»</p>
        <p>Emisiones: {{ emisiones() }}</p>
        <ul class="listado">
          @for (o of filtrados(); track o.id) {
            <li>{{ o.codigo }} · {{ o.equipo }} · {{ o.tecnico }}</li>
          } @empty {
            <li class="vacio">Ninguna orden coincide con «{{ ultimo() }}»</li>
          }
        </ul>
      </div>

      <form [formGroup]="form" (ngSubmit)="enviar()" novalidate>
        <label>
          Código
          <input formControlName="codigo" placeholder="AB123" autocomplete="off" />
        </label>
        @if (mostrar(form.controls.codigo)) {
          <p class="error">
            @if (form.controls.codigo.hasError('required')) { El código es obligatorio. }
            @if (form.controls.codigo.hasError('pattern')) { Formato: dos letras mayúsculas y tres dígitos (AB123). }
            <small>[{{ claves(form.controls.codigo) }}]</small>
          </p>
        }

        <label>
          Cantidad
          <input type="number" formControlName="cantidad" />
        </label>
        @if (mostrar(form.controls.cantidad)) {
          <p class="error">
            @if (form.controls.cantidad.hasError('required')) { La cantidad es obligatoria. }
            @if (form.controls.cantidad.hasError('min')) { La cantidad mínima es 1. }
            @if (form.controls.cantidad.hasError('max')) { La cantidad máxima es {{ tope }}. }
            @if (form.controls.cantidad.hasError('multiplo')) { La cantidad debe ser múltiplo de {{ m }}. }
            <small>[{{ claves(form.controls.cantidad) }}]</small>
          </p>
        }

        <div formGroupName="periodo" class="periodo">
          <label>
            Desde
            <input type="number" formControlName="desde" />
          </label>
          <label>
            Hasta
            <input type="number" formControlName="hasta" />
          </label>
        </div>
        @if (mostrar(form.controls.periodo.controls.desde)) {
          <p class="error">«Desde» es obligatorio. <small>[{{ claves(form.controls.periodo.controls.desde) }}]</small></p>
        }
        @if (mostrar(form.controls.periodo.controls.hasta)) {
          <p class="error">«Hasta» es obligatorio. <small>[{{ claves(form.controls.periodo.controls.hasta) }}]</small></p>
        }
        @if (errorPeriodo()) {
          <p class="error">«Hasta» debe ser mayor que «desde». <small>[hastaMayor]</small></p>
        }

        <button type="submit">Enviar</button>
      </form>

      @if (aviso()) {
        <p class="ok">{{ aviso() }}</p>
      }
    </section>
  `,
  styles: `
    .parcial { display: block; }
    h1 { font-size: 1.5rem; font-weight: 800; color: #0f172a; }
    .params { color: #64748b; font-size: .85rem; margin-bottom: 1rem; }
    form { display: grid; gap: .5rem; max-width: 24rem; }
    label { display: grid; gap: .2rem; font-size: .85rem; font-weight: 600; color: #334155; }
    input { border: 1px solid #cbd5e1; border-radius: .4rem; padding: .4rem .6rem; font-weight: 400; background: #fff; }
    .periodo { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; }
    .error { color: #b91c1c; font-size: .8rem; margin: 0; }
    .error small { color: #94a3b8; }
    .buscar { margin-bottom: 1.5rem; padding: .8rem; border: 1px solid #e2e8f0; border-radius: .5rem; background: #fff; max-width: 24rem; }
    .buscar p { font-size: .85rem; color: #334155; margin: .3rem 0 0; }
    .listado { margin-top: .5rem; font-size: .85rem; color: #0f172a; }
    .listado .vacio { color: #64748b; }
    button { margin-top: .5rem; background: #1e293b; color: #fff; border-radius: .4rem; padding: .5rem 1rem; font-weight: 700; }
    .ok { margin-top: 1rem; color: #166534; font-weight: 600; }
  `,
})
export class Parcial2 {
  readonly m = M;
  readonly tope = TOPE;

  private fb = inject(NonNullableFormBuilder);

  // NonNullableFormBuilder: al reiniciar, cada control vuelve a su valor
  // inicial y no a null, así ningún campo queda con valor nulo.
  form = this.fb.group({
    codigo: ['', [Validators.required, Validators.pattern(PATRON_CODIGO)]],
    cantidad: [0, [Validators.required, rango(1, TOPE), multiplo(M)]],
    periodo: this.fb.group(
      {
        desde: [DESDE, Validators.required],
        hasta: [DESDE + 1, Validators.required],
      },
      { validators: hastaMayor('desde', 'hasta') },
    ),
  });

  aviso = signal('');

  // R2 · búsqueda reactiva.
  // trim: valor sin espacios en los extremos · debounceTime(300): se emite
  // solo tras 300 ms sin escribir · distinctUntilChanged: nunca igual al
  // emitido inmediatamente antes. takeUntilDestroyed limpia la suscripción.
  buscar = new FormControl('', { nonNullable: true });
  ultimo = signal('');
  emisiones = signal(0);

  private servicio = inject(OrdenService);

  // El listado de órdenes se filtra con el último valor emitido (equipo o técnico).
  // filter produce un arreglo nuevo; la lista del servicio no se modifica.
  filtrados = computed(() => {
    const texto = normalizar(this.ultimo());
    return this.servicio
      .ordenes()
      .filter((o) => normalizar(o.equipo).includes(texto) || normalizar(o.tecnico).includes(texto));
  });

  constructor() {
    this.buscar.valueChanges
      .pipe(
        map((texto) => texto.trim()),
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe((valor) => {
        this.ultimo.set(valor);
        this.emisiones.update((n) => n + 1);
      });
  }

  /** Un error se muestra solo cuando el usuario tocó o modificó el campo. */
  mostrar(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  claves(control: AbstractControl): string {
    return Object.keys(control.errors ?? {}).join(', ');
  }

  errorPeriodo(): boolean {
    const periodo = this.form.controls.periodo;
    const hasta = periodo.controls.hasta;
    const desde = periodo.controls.desde;
    const tocado = hasta.touched || hasta.dirty || desde.touched || desde.dirty;
    return periodo.hasError('hastaMayor') && tocado;
  }

  enviar(): void {
    if (this.form.invalid) {
      // Envío inválido: se marcan todos como tocados y aparecen todos los errores.
      this.form.markAllAsTouched();
      this.aviso.set('');
      return;
    }
    const { codigo, cantidad } = this.form.getRawValue();
    this.aviso.set(`Solicitud válida: ${codigo} · ${cantidad}`);
  }
}
