import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdenService } from '../services/orden.service';
import { minimoItems, rangoFechas, sinSoloEspacios } from '../validators/validadores';

@Component({
  selector: 'app-formulario-orden',
  imports: [ReactiveFormsModule],
  template: `
    <form class="formulario" [formGroup]="form" (ngSubmit)="enviar()" novalidate>
      <h2>Nueva orden de mantenimiento</h2>

      <div class="rejilla">
        <div class="campo">
          <label for="equipo">Equipo</label>
          <input id="equipo" type="text" formControlName="equipo" />
          @if (equipo.invalid && (equipo.touched || equipo.dirty)) {
            <small class="error">{{ mensaje(equipo) }}</small>
          }
        </div>

        <div class="campo">
          <label for="tipo">Tipo de mantenimiento</label>
          <select id="tipo" formControlName="tipo">
            <option value="">Seleccione…</option>
            @for (t of tipos; track t) {
              <option [value]="t">{{ t }}</option>
            }
          </select>
          @if (tipo.invalid && (tipo.touched || tipo.dirty)) {
            <small class="error">{{ mensaje(tipo) }}</small>
          }
        </div>

        <div class="campo">
          <label for="tecnico">Técnico</label>
          <input id="tecnico" type="text" formControlName="tecnico" />
          @if (tecnico.invalid && (tecnico.touched || tecnico.dirty)) {
            <small class="error">{{ mensaje(tecnico) }}</small>
          }
        </div>

        <div class="campo">
          <label for="correoTecnico">Correo del técnico</label>
          <input id="correoTecnico" type="email" formControlName="correoTecnico" />
          @if (correoTecnico.invalid && (correoTecnico.touched || correoTecnico.dirty)) {
            <small class="error">{{ mensaje(correoTecnico) }}</small>
          }
        </div>

        <div class="campo">
          <label for="fechaInicio">Fecha de inicio</label>
          <input id="fechaInicio" type="date" formControlName="fechaInicio" />
          @if (fechaInicio.invalid && (fechaInicio.touched || fechaInicio.dirty)) {
            <small class="error">{{ mensaje(fechaInicio) }}</small>
          }
        </div>

        <div class="campo">
          <label for="fechaFin">Fecha de fin</label>
          <input id="fechaFin" type="date" formControlName="fechaFin" />
          @if (fechaFin.invalid && (fechaFin.touched || fechaFin.dirty)) {
            <small class="error">{{ mensaje(fechaFin) }}</small>
          }
        </div>

        <div class="campo">
          <label for="presupuesto">Presupuesto (COP)</label>
          <input id="presupuesto" type="number" formControlName="presupuesto" />
          @if (presupuesto.invalid && (presupuesto.touched || presupuesto.dirty)) {
            <small class="error">{{ mensaje(presupuesto) }}</small>
          }
        </div>
      </div>

      @if (form.errors?.['rangoFechas'] && (form.touched || form.dirty)) {
        <p class="error error-grupo">La fecha de fin no puede ser anterior a la fecha de inicio.</p>
      }

      <fieldset class="tareas">
        <legend>Tareas de la orden</legend>

        @for (t of tareas.controls; track t; let i = $index) {
          <div class="fila" [formGroup]="t">
            <div class="campo">
              <label [for]="'descripcion' + i">Descripción</label>
              <input [id]="'descripcion' + i" type="text" formControlName="descripcion" />
              @if (t.controls.descripcion.invalid && (t.controls.descripcion.touched || t.controls.descripcion.dirty)) {
                <small class="error">{{ mensaje(t.controls.descripcion) }}</small>
              }
            </div>
            <div class="campo corto">
              <label [for]="'horas' + i">Horas estimadas</label>
              <input [id]="'horas' + i" type="number" step="0.5" formControlName="horas" />
              @if (t.controls.horas.invalid && (t.controls.horas.touched || t.controls.horas.dirty)) {
                <small class="error">{{ mensaje(t.controls.horas) }}</small>
              }
            </div>
            <button type="button" class="quitar" (click)="quitarTarea(i)">Quitar</button>
          </div>
        }

        @if (tareas.errors?.['minimoItems'] && (tareas.touched || tareas.dirty)) {
          <p class="error">Agregue al menos una tarea a la orden.</p>
        }

        <button type="button" class="secundario" (click)="agregarTarea()">Agregar tarea</button>
      </fieldset>

      <button type="submit" class="enviar" [disabled]="form.invalid">Registrar orden</button>
    </form>
  `,
  styles: `
    .formulario { display: flex; flex-direction: column; gap: 1rem; border: 1px solid #cbd5e1; border-radius: .8rem; padding: 1.2rem; background: #fff; }
    h2 { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0; }
    .rejilla { display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: .9rem; }
    .campo { display: flex; flex-direction: column; gap: .25rem; }
    .campo.corto { width: 9rem; }
    label { font-size: .8rem; font-weight: 700; color: #334155; }
    input, select { border: 1px solid #94a3b8; border-radius: .4rem; padding: .45rem .6rem; font-size: .9rem; }
    input.ng-invalid.ng-touched, select.ng-invalid.ng-touched { border-color: #dc2626; }
    .error { color: #b91c1c; font-size: .78rem; margin: 0; }
    .error-grupo { background: #fee2e2; border-radius: .4rem; padding: .5rem .8rem; font-weight: 600; }
    .tareas { border: 1px dashed #94a3b8; border-radius: .6rem; padding: .8rem; display: flex; flex-direction: column; gap: .7rem; }
    legend { font-size: .85rem; font-weight: 800; color: #0f172a; padding: 0 .4rem; }
    .fila { display: flex; align-items: flex-start; gap: .8rem; }
    .fila .campo:first-child { flex: 1; }
    .quitar { margin-top: 1.35rem; border-radius: .4rem; background: #991b1b; color: #fff; padding: .4rem .8rem; font-size: .8rem; font-weight: 700; }
    .secundario { align-self: flex-start; border: 1px solid #1e293b; border-radius: .4rem; background: #fff; color: #1e293b; padding: .4rem .9rem; font-size: .85rem; font-weight: 700; }
    .enviar { align-self: flex-start; border-radius: .5rem; background: #1e293b; color: #fff; padding: .55rem 1.4rem; font-weight: 800; }
    .enviar:disabled { opacity: .35; cursor: not-allowed; }
  `,
})
export class FormularioOrden {
  private readonly fb = inject(FormBuilder);
  private readonly servicio = inject(OrdenService);

  readonly tipos = ['Preventivo', 'Correctivo', 'Predictivo'];

  readonly form = this.fb.nonNullable.group(
    {
      equipo: ['', [Validators.required, Validators.minLength(3), sinSoloEspacios]],
      tipo: ['', [Validators.required]],
      tecnico: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[\p{L}][\p{L} .'-]*$/u),
          sinSoloEspacios,
        ],
      ],
      correoTecnico: ['', [Validators.required, Validators.email]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      presupuesto: [0, [Validators.required, Validators.min(0)]],
      tareas: this.fb.array([this.crearTarea()], [minimoItems(1)]),
    },
    { validators: [rangoFechas] },
  );

  get equipo() { return this.form.controls.equipo; }
  get tipo() { return this.form.controls.tipo; }
  get tecnico() { return this.form.controls.tecnico; }
  get correoTecnico() { return this.form.controls.correoTecnico; }
  get fechaInicio() { return this.form.controls.fechaInicio; }
  get fechaFin() { return this.form.controls.fechaFin; }
  get presupuesto() { return this.form.controls.presupuesto; }
  get tareas() { return this.form.controls.tareas; }

  private crearTarea() {
    return this.fb.nonNullable.group({
      descripcion: ['', [Validators.required, Validators.minLength(3), sinSoloEspacios]],
      horas: [1, [Validators.required, Validators.min(0.5)]],
    });
  }

  agregarTarea() {
    this.tareas.push(this.crearTarea());
  }

  quitarTarea(indice: number) {
    this.tareas.removeAt(indice);
    this.tareas.markAsDirty();
  }

  mensaje(control: AbstractControl): string {
    const errores = control.errors;
    if (!errores) return '';
    if (errores['required']) return 'Este campo es obligatorio.';
    if (errores['soloEspacios']) return 'No puede estar formado solo por espacios.';
    if (errores['minlength']) return `Debe tener al menos ${errores['minlength'].requiredLength} caracteres.`;
    if (errores['email']) return 'Escriba un correo electrónico válido.';
    if (errores['pattern']) return 'Use solo letras, espacios, punto, apóstrofo o guion.';
    if (errores['min']) return `El valor mínimo permitido es ${errores['min'].min}.`;
    return 'El valor no es válido.';
  }

  enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.servicio.agregar(this.form.getRawValue());
    this.tareas.clear();
    this.form.reset();
    this.agregarTarea();
  }
}
