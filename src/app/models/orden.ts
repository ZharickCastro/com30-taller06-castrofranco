export type EstadoOrden = 'Pendiente' | 'En curso' | 'Terminada';

export const ESTADOS: EstadoOrden[] = ['Pendiente', 'En curso', 'Terminada'];

export interface Tarea {
  descripcion: string;
  horas: number;
}

export interface Orden {
  id: number;
  equipo: string;
  tipo: string;
  tecnico: string;
  correoTecnico: string;
  fechaInicio: string;
  fechaFin: string;
  presupuesto: number;
  tareas: Tarea[];
  estado: EstadoOrden;
}

export type NuevaOrden = Omit<Orden, 'id' | 'estado'>;
