import { Routes } from '@angular/router';
import { ListadoOrdenes } from './components/listado-ordenes';
import { NoEncontrada } from './components/no-encontrada';
import { DetalleOrden } from './components/detalle-orden';
import { FormularioOrden } from './components/formulario-orden';

// El enrutador recorre la lista de arriba abajo y se queda con la primera coincidencia:
// 'ordenes/nueva' va antes de 'ordenes/:id' (si no, «nueva» se leería como un código)
// y el comodín '**' va siempre al final.
export const routes: Routes = [
  { path: '', redirectTo: 'ordenes', pathMatch: 'full' },
  { path: 'ordenes', component: ListadoOrdenes, title: 'Órdenes de mantenimiento' },
  { path: 'ordenes/nueva', component: FormularioOrden, title: 'Nueva orden' },
  { path: 'ordenes/:id', component: DetalleOrden, title: 'Detalle de la orden' },
  {
    path: 'estadisticas',
    title: 'Estadísticas',
    // Carga diferida: resumen-ordenes.ts no va en el paquete inicial; se descarga
    // en un chunk aparte la primera vez que se entra a /estadisticas.
    loadComponent: () => import('./components/resumen-ordenes').then((m) => m.ResumenOrdenes),
  },
  { path: '**', component: NoEncontrada, title: 'Página no encontrada' },
];
