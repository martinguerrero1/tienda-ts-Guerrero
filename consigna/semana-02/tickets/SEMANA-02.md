# 🎫 Tickets — Semana 2 (Fundación + TypeScript)

> Estos son **tus tickets de esta semana**. Formato ticket real: tienen
> contexto, criterios de aceptación y definición de terminado.
> No te decimos el cómo. El cómo es tu trabajo.

**Entrega:** repo en GitHub + link al último commit + sección `## Uso de IA`.
**Deadline:** antes de la Clase 3.

---

## TICKET #1 — `chore: project setup con tooling de calidad`

**Contexto**
Necesitamos la fundación del proyecto. Sin esto, todo lo demás se construye sobre arena.

**Tareas**
- Inicializar proyecto con Vite + React + TypeScript.
- Configurar TailwindCSS.
- Configurar React Router (aunque sea con rutas vacías por ahora).
- Configurar ESLint + Prettier + Husky + lint-staged + commitlint.
- `tsconfig.json` con `strict: true`.

**Criterios de aceptación**
- [ ] `npm run dev` levanta la app.
- [ ] Tailwind aplica estilos (probalo con una clase visible).
- [ ] Un commit con `const x: any = 1` en código staged **es rechazado**.
- [ ] Un commit con mensaje `"cambios"` **es rechazado**.
- [ ] El primer commit es `chore: project setup ...` (convencional).

**Definición de terminado**
Clonás el repo en limpio, `npm install && npm run dev` y funciona. El tooling
bloquea código sucio. Si esto no se cumple, el ticket NO está hecho.

---

## TICKET #2 — `feat: modelo de dominio tipado`

**Contexto**
Antes de pintar nada, definimos los tipos del negocio. La API es DummyJSON
(`https://dummyjson.com/products`). El JSON de ejemplo está en la clase
(`clase-02.../02-tipar-api/RESPUESTA-EJEMPLO.json`).

**Tareas**
- Crear `src/types/` con el tipo fuente `Producto` (solo los campos que la
  app va a usar — no tipes los 30 campos del JSON).
- Derivar con utility types al menos: `ProductoPreview` (para la card) y
  `ProductoEnCarrito` (Producto + `cantidad`).
- Tipar la forma de la respuesta de la API (`products`, `total`, `skip`, `limit`).

**Criterios de aceptación**
- [ ] Un único `Producto` fuente; el resto **derivado** con `Pick`/`Omit`/etc.
- [ ] Cero `any`.
- [ ] `ProductoEnCarrito` reutiliza `Producto`, no lo copia.
- [ ] Justificás (en el commit o PR) qué campos NO tipaste y por qué.

---

## TICKET #3 — `feat: catálogo con datos estáticos tipados`

**Contexto**
Todavía no consumimos la API (eso es Semana 4). Esta semana el catálogo usa
datos **estáticos** (un array mock) pero **totalmente tipado** con el modelo
del Ticket #2.

**Tareas**
- Crear un mock `src/data/productos.ts` con 6-8 productos tipados como `Producto[]`.
- Página `Catalogo` que renderiza una grilla de `ProductCard`.
- `ProductCard` es un componente tipado (props con `interface`).
- Página `DetalleProducto` (ruta `/producto/:id`) que muestra un producto.
- Routing con React Router entre catálogo y detalle.

**Criterios de aceptación**
- [ ] La grilla renderiza desde el array tipado (no HTML hardcodeado).
- [ ] `ProductCard` recibe props tipadas, sin `any`.
- [ ] Click en una card navega al detalle correcto.
- [ ] Si el `:id` no existe, se maneja (no crashea).
- [ ] Estilado con Tailwind (no CSS suelto).

**Definición de terminado**
Navegás catálogo → detalle → volver, todo tipado, sin warnings de consola,
commits convencionales que cuentan la historia.

---

## 🧪 Reto opcional (suma en la defensa)

`feat: componente Lista genérico`
Implementá un componente **genérico** `<Lista<T>>` reutilizable y usalo para
renderizar la grilla del catálogo. Tenés que poder explicar por qué el genérico
mantiene el tipado de cada ítem.

---

## 📋 Cómo se evalúa esta semana

Ver `../EVALUACION.md`. Resumen: no se evalúa solo que "funcione". Se evalúa
tooling real, tipado sin `any`, estructura, calidad de commits y que puedas
**defender tu código**.

> 🗣️ En la Clase 3 se eligen alumnos al azar para abrir su repo y explicar
> una decisión de tipado en vivo.
