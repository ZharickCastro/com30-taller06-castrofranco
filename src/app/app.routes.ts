import { Routes } from '@angular/router';
import { ListadoOrdenes } from './components/listado-ordenes';
import { NoEncontrada } from './components/no-encontrada';
import { DetalleOrden } from './components/detalle-orden';

// El enrutador recorre la lista de arriba abajo y se queda con la primera coincidencia:
// 'ordenes/nueva' va antes de 'ordenes/:id' (si no, «nueva» se leería como un código)
// y el comodín '**' va siempre al final.
export const routes: Routes = [
  { path: '', redirectTo: 'ordenes', pathMatch: 'full' },
  { path: 'ordenes', component: ListadoOrdenes, title: 'Órdenes de mantenimiento' },
  { path: 'ordenes/:id', component: DetalleOrden, title: 'Detalle de la orden' },
  { path: '**', component: NoEncontrada, title: 'Página no encontrada' },
];
