import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const sinSoloEspacios: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = control.value;
  if (typeof valor !== 'string' || valor.length === 0) return null;
  return valor.trim().length === 0 ? { soloEspacios: true } : null;
};

export const rangoFechas: ValidatorFn = (grupo: AbstractControl): ValidationErrors | null => {
  const inicio = grupo.get('fechaInicio')?.value as string;
  const fin = grupo.get('fechaFin')?.value as string;
  if (!inicio || !fin) return null;
  return fin >= inicio ? null : { rangoFechas: { inicio, fin } };
};

export function minimoItems(minimo: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    const cantidad = Array.isArray(valor) ? valor.length : 0;
    return cantidad >= minimo ? null : { minimoItems: { requerido: minimo, actual: cantidad } };
  };
}
