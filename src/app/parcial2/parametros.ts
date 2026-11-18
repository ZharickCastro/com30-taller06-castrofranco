// Parcial 2 · parámetros de la tabla 1 para el último dígito de la cédula.
// m = 2 + d mod 5 · tope = m × (4 + d mod 3) · desde = d + 1
export const D = 0;
export const M = 2 + (D % 5); // 2
export const TOPE = M * (4 + (D % 3)); // 8
export const DESDE = D + 1; // 1
export const PALABRA = 'lote';

// Formato del código: dos letras mayúsculas y tres dígitos (AB123).
export const PATRON_CODIGO = /^[A-Z]{2}\d{3}$/;
