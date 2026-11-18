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
  components/resumen-ordenes.ts      vista de estadísticas (carga diferida con loadComponent)
  components/busqueda-ordenes.ts     búsqueda reactiva (Taller 07)
  components/detalle-orden.ts        detalle /ordenes/:id
  components/no-encontrada.ts        vista 404 (comodín **)
  app.routes.ts                      mapa de rutas
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

## Taller 07 · Búsqueda reactiva

Vista `/busqueda` (menú «Búsqueda»). El texto se busca, sin tildes ni mayúsculas y recortado con `trim()`,
en dos campos de la orden: **equipo** y **técnico**. Con menos de 2 caracteres no se consulta.

- Servicio (`orden.service.ts`): `buscar(texto)` devuelve un `Observable` con un retardo simulado de
  `max(150, 1500 − 300 × longitud)` ms y suma 1 a la signal `llamadas` (privada, expuesta con `asReadonly()`).
- Componente (`busqueda-ordenes.ts`): `valueChanges` → `map(trim)` → `debounceTime(300)` →
  `distinctUntilChanged()` → `switchMap` (con `of([])` bajo 2 caracteres). El resultado se expone con
  `toSignal(..., { initialValue: [] })`; el filtro por estado es una signal y un `computed`, y no consulta.
- Historial de las 5 últimas consultas con `subscribe` y `takeUntilDestroyed()`.

Pruebas rápidas: «perez» → 3 órdenes (OM01, OM05, OM09); «turbina» → «Sin coincidencias»;
«x» → mensaje de mínimo 2 caracteres, sin consulta.

## Taller 08 · Rutas y navegación

El proyecto del Taller 06 se amplía con rutas (Angular Router). Los datos siguen en el servicio con
signal; el servicio arranca con 12 órdenes de ejemplo (OM01 a OM12: Pendiente 5, En curso 4, Terminada 3).

### Tabla de rutas (en el orden de `app.routes.ts`)

| Ruta | Vista (componente) | Parámetro o carga |
| --- | --- | --- |
| `/` | — | Redirige a `/ordenes` (`pathMatch: 'full'`) |
| `/ordenes` | `ListadoOrdenes` | Parámetro de consulta `?estado=` → `input()` `estado` |
| `/ordenes/nueva` | `FormularioOrden` | Al guardar, `router.navigate(['/ordenes', codigo])` |
| `/ordenes/:id` | `DetalleOrden` | Parámetro de ruta `:id` → `input.required()` `id` |
| `/busqueda` | `BusquedaOrdenes` | Búsqueda reactiva del Taller 07 |
| `/estadisticas` | `ResumenOrdenes` | Carga diferida con `loadComponent` |
| `**` | `NoEncontrada` | Comodín, siempre al final (vista 404) |

`/ordenes/nueva` va antes de `/ordenes/:id`; en el orden contrario «nueva» se leería como un código.
`provideRouter(routes, withComponentInputBinding())` en `app.config.ts` entrega los parámetros a los `input()`.

### Pruebas rápidas

- `/ordenes?estado=Pendiente` → 5 órdenes; F5 conserva el filtro.
- `/ordenes?estado=Cancelada` → mensaje de lista vacía (`@empty`).
- `/ordenes/OM05` → detalle de la orden; `/ordenes/OM99` → «No existe la orden OM99».
- `/reportes` → vista 404 con la dirección y un enlace al listado.
