import { Component } from '@angular/core';
import { FormularioOrden } from './components/formulario-orden';
import { ListadoOrdenes } from './components/listado-ordenes';

@Component({
  selector: 'app-root',
  imports: [FormularioOrden, ListadoOrdenes],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
