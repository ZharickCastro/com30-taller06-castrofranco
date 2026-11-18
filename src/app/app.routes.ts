import { Routes } from '@angular/router';
import { ListadoOrdenes } from './components/listado-ordenes';
import { NoEncontrada } from './components/no-encontrada';
import { DetalleOrden } from './components/detalle-orden';
import { FormularioOrden } from './components/formulario-orden';
import { BusquedaOrdenes } from './components/busqueda-ordenes';
import { Parcial2 } from './parcial2/parcial2';
import { Parcial2Detalle } from './parcial2/detalle';

// El enrutador recorre la lista de arriba abajo y se queda con la primera coincidencia:
// 'ordenes/nueva' va antes de 'ordenes/:id' (si no, «nueva» se leería como un código)
// y el comodín '**' va siempre al final.
export const routes: Routes = [
  { path: '', redirectTo: 'ordenes', pathMatch: 'full' },
  { path: 'ordenes', component: ListadoOrdenes, title: 'Órdenes de mantenimiento' },
  { path: 'ordenes/nueva', component: FormularioOrden, title: 'Nueva orden' },
  { path: 'ordenes/:id', component: DetalleOrden, title: 'Detalle de la orden' },
  { path: 'busqueda', component: BusquedaOrdenes, title: 'Buscar órdenes' },
  {
    path: 'estadisticas',
    title: 'Estadísticas',
    // Carga diferida: resumen-ordenes.ts no va en el paquete inicial; se descarga
    // en un chunk aparte la primera vez que se entra a /estadisticas.
    loadComponent: () => import('./components/resumen-ordenes').then((m) => m.ResumenOrdenes),
  },
  { path: 'parcial2', component: Parcial2, title: 'Parcial 2 · Solicitud' },
  // /parcial2/detalle/:codigo?cantidad=n · /parcial2/otra no coincide y cae en '**' (404)
  { path: 'parcial2/detalle/:codigo', component: Parcial2Detalle, title: 'Parcial 2 · Detalle' },
  { path: '**', component: NoEncontrada, title: 'Página no encontrada' },
];
