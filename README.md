# COM30 · Taller 06 · Órdenes de mantenimiento

Aplicación de una sola pantalla para registrar y gestionar órdenes de mantenimiento de equipos.
Taller 06 de Programación con Frameworks para Web (IUB, 2026-III), sesiones S05, S06 y S07.

**Escenario elegido:** E4 · Orden de mantenimiento.

## Qué hace

- Un formulario reactivo captura la orden: equipo, tipo, técnico, correo del técnico, fecha de inicio,
  fecha de fin, presupuesto y una lista dinámica de tareas (descripción y horas estimadas).
- El servicio guarda las órdenes en una signal y expone el total y los pendientes.
- El listado permite cambiar el estado de cada orden (Pendiente, En curso, Terminada), eliminarla y
  abrir un panel de resumen que se carga con `@defer (on interaction)`.

## Estructura

```
src/app/
  models/orden.ts                    interfaces Orden, Tarea y tipos de estado
  services/orden.service.ts          servicio con la signal privada y asReadonly()
  validators/validadores.ts          sinSoloEspacios, rangoFechas y minimoItems
  components/formulario-orden.ts     formulario reactivo con FormArray de tareas
  components/listado-ordenes.ts      listado con @for, @empty y cambio de estado
  components/resumen-ordenes.ts      panel de resumen cargado con @defer
```

## Validación

- Validadores integrados: `required`, `minLength`, `email`, `pattern` y `min`.
- Validador propio de control: `sinSoloEspacios` (clave de error `soloEspacios`).
- Validador de grupo: `rangoFechas` (la fecha de fin no puede ser anterior a la de inicio).
- Validador del `FormArray`: `minimoItems(1)` exige al menos una tarea.

## Cómo ejecutarla

Requiere Node.js y Angular CLI.

```bash
npm install
npx ng serve
```

La aplicación abre en `http://localhost:4200`. Para comprobar que compila:

```bash
npx ng build
```
