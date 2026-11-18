import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validadores propios del Parcial 2.
// Un validador devuelve null cuando el valor cumple, o un objeto con la clave
// del error cuando no cumple. Un valor vacío no se evalúa aquí: de eso se
// encarga Validators.required, así cada regla reporta solo su propio error.

function vacio(valor: unknown): boolean {
  return valor === null || valor === undefined || valor === '';
}

/** Rango de un control numérico: min ≤ valor ≤ max. Errores: min y max. */
export function rango(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (vacio(control.value)) return null;
    const valor = Number(control.value);
    if (valor < min) return { min: { min, actual: valor } };
    if (valor > max) return { max: { max, actual: valor } };
    return null;
  };
}

/** El valor debe ser múltiplo de m. Error: multiplo. */
export function multiplo(m: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (vacio(control.value)) return null;
    const valor = Number(control.value);
    return valor % m === 0 ? null : { multiplo: { m, actual: valor } };
  };
}

/** Validador de grupo: el control `hasta` debe ser mayor que `desde`. Error: hastaMayor. */
export function hastaMayor(desde: string, hasta: string): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const d = grupo.get(desde)?.value;
    const h = grupo.get(hasta)?.value;
    if (vacio(d) || vacio(h)) return null;
    return Number(h) > Number(d) ? null : { hastaMayor: { desde: d, hasta: h } };
  };
}
