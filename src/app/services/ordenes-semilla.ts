import { EstadoOrden, Orden } from '../models/orden';

// 12 órdenes de partida: Pendiente 5 · En curso 4 · Terminada 3.
const filas: [string, string, string, string, string, number, string, number, EstadoOrden][] = [
  ['Compresor de aire 1', 'Preventivo', 'Ana Pérez', '2026-11-02', '2026-11-03', 250000, 'Cambiar filtro de aire', 2, 'Pendiente'],
  ['Montacargas 2', 'Correctivo', 'Luis Gómez', '2026-11-03', '2026-11-06', 1200000, 'Reemplazar bomba hidráulica', 6, 'En curso'],
  ['Torno CNC 1', 'Predictivo', 'María Ruiz', '2026-11-04', '2026-11-04', 480000, 'Análisis de vibraciones', 3, 'Terminada'],
  ['Caldera 1', 'Preventivo', 'Carlos Díaz', '2026-11-05', '2026-11-07', 900000, 'Limpieza de quemadores', 5, 'Pendiente'],
  ['Banda transportadora 3', 'Correctivo', 'Ana Pérez', '2026-11-05', '2026-11-05', 320000, 'Cambiar rodillo', 2, 'Terminada'],
  ['Aire acondicionado sala 2', 'Preventivo', 'Luis Gómez', '2026-11-06', '2026-11-06', 150000, 'Limpiar serpentines', 1.5, 'En curso'],
  ['Generador eléctrico', 'Predictivo', 'María Ruiz', '2026-11-08', '2026-11-09', 700000, 'Termografía del tablero', 4, 'Pendiente'],
  ['Prensa hidráulica', 'Correctivo', 'Carlos Díaz', '2026-11-09', '2026-11-12', 1500000, 'Cambiar sellos del pistón', 8, 'En curso'],
  ['Compresor de aire 2', 'Preventivo', 'Ana Pérez', '2026-11-10', '2026-11-10', 250000, 'Revisar correas', 1.5, 'Terminada'],
  ['Montacargas 1', 'Preventivo', 'Luis Gómez', '2026-11-12', '2026-11-13', 400000, 'Cambio de aceite', 2, 'Pendiente'],
  ['Fresadora 2', 'Predictivo', 'María Ruiz', '2026-11-13', '2026-11-14', 380000, 'Medir desgaste de husillo', 3, 'En curso'],
  ['Bomba de agua 1', 'Correctivo', 'Carlos Díaz', '2026-11-16', '2026-11-18', 600000, 'Reemplazar impulsor', 5, 'Pendiente'],
];

const correo = (nombre: string) =>
  nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(' ', '.') + '@empresa.com';

export const ORDENES_SEMILLA: Orden[] = filas.map(
  ([equipo, tipo, tecnico, fechaInicio, fechaFin, presupuesto, tarea, horas, estado], i) => ({
    id: i + 1,
    codigo: 'OM' + String(i + 1).padStart(2, '0'),
    equipo,
    tipo,
    tecnico,
    correoTecnico: correo(tecnico),
    fechaInicio,
    fechaFin,
    presupuesto,
    tareas: [{ descripcion: tarea, horas }],
    estado,
  }),
);
