# 🛒 Tasks — Custom Hooks · Context API · useMemo · useCallback

> **Proyecto:** "ShopHook" — Tienda de productos con carrito y búsqueda  
> **Stack:** React + TypeScript + TailwindCSS  
> **API:** `https://dummyjson.com/products`  
> **Entrega:** Repositorio en GitHub con el link en el canal de la clase.

---

## Contexto del proyecto

Vas a construir una pequeña tienda de productos donde los usuarios pueden:

- Buscar y filtrar productos
- Agregar/quitar productos de un carrito de favoritos
- Ver el resumen del carrito con totales calculados
- Que el carrito **persista al refrescar** la página

Cada ticket está diseñado para practicar un concepto específico. No saltes tickets: cada uno se apoya en el anterior.

---

## ⚠️ Reglas del proyecto

1. **Cero `any`.** Si TypeScript te pide un tipo, ponelo. Si no sabés cuál es, buscalo.
2. **Cero lógica en el JSX.** Si estás escribiendo `useState` o `useEffect` dentro de un componente que también tiene JSX, movelo a un hook.
3. **Cada feature en su carpeta.** El carrito vive en `features/carrito/`. Los hooks transversales en `hooks/`.
4. **Commits convencionales** después de completar cada ticket (`feat:`, `refactor:`, `fix:`).

---

## Estructura de carpetas esperada al final

```
src/
├── features/
│   └── carrito/
│       ├── CarritoContext.tsx
│       └── useCarrito.ts
├── hooks/
│   ├── useToggle.ts
│   ├── useLocalStorage.ts
│   ├── useProductos.ts
│   └── useDebounce.ts          ← Bonus
├── types/
│   └── index.ts
├── components/
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   └── CarritoDrawer.tsx
└── pages/
    └── Home.tsx
```

---

---

# 🎫 TICKET 01 — `useToggle`

**Concepto:** Custom hook básico · encapsulamiento de estado de UI

### Qué tenés que construir

Un hook `useToggle(initialValue?: boolean)` que devuelva un booleano y 3 acciones con nombres semánticos.

### Contrato

```ts
// Entra: valor inicial (opcional, default false)
// Sale:
//   value     → boolean actual
//   activar   → () => void  — fuerza true
//   desactivar→ () => void  — fuerza false
//   toggle    → () => void  — invierte el valor actual
// Invariante: las 3 funciones nunca cambian de referencia entre renders
```

### Dónde usarlo en el proyecto

Usá `useToggle` para:

- Abrir/cerrar el drawer del carrito
- Mostrar/ocultar un panel de filtros de categoría
- Controlar si un modal de "producto agregado" está visible

### Criterios de aceptación

- [ ] El hook está en `src/hooks/useToggle.ts`
- [ ] Las 3 acciones están envueltas en `useCallback`
- [ ] El componente que usa el hook **no tiene `useState`** propio para esos booleanos
- [ ] Usás el hook al menos en 2 lugares distintos del proyecto

### Tip

> ¿Por qué `useCallback` en las acciones? Porque si las pasás como prop a un componente con `React.memo`, sin `useCallback` vas a generar un re-render en cada render del padre aunque el booleano no haya cambiado.

---

---

# 🎫 TICKET 02 — `useLocalStorage<T>`

**Concepto:** Custom hook genérico · persistencia · manejo de errores silenciosos

### Qué tenés que construir

Un hook `useLocalStorage<T>(key: string, initialValue: T)` que funcione exactamente como `useState`, pero que sincronice el valor con `localStorage`.

### Contrato

```ts
// Entra: clave de storage (string) + valor inicial (T)
// Sale: [value, setter]  —  misma API que useState
// Invariante: si el storage tiene JSON corrupto, usa initialValue sin crashear
```

### Comportamiento esperado

| Situación                    | Comportamiento                      |
| ---------------------------- | ----------------------------------- |
| Primera carga, storage vacío | Devuelve `initialValue`             |
| Carga con valor guardado     | Devuelve el valor parseado          |
| Storage con JSON inválido    | Devuelve `initialValue` (sin crash) |
| `setter` llamado             | Actualiza state Y storage           |

### Cómo probar el caso de JSON corrupto

1. DevTools → Application → Local Storage
2. Editá manualmente el valor de la clave a `{corrupto`
3. Recargá la página
4. La app tiene que funcionar normalmente

### Criterios de aceptación

- [ ] El hook está en `src/hooks/useLocalStorage.ts`
- [ ] Usa un `try/catch` en la inicialización lazy (dentro del callback de `useState`)
- [ ] El tipo de retorno es `[T, Dispatch<SetStateAction<T>>]`
- [ ] Está siendo usado por el `CarritoProvider` (Ticket 04)

---

---

# 🎫 TICKET 03 — `useProductos`

**Concepto:** Custom hook de fetching · discriminated union · AbortController

### Qué tenés que construir

Un hook `useProductos({ search?: string })` que encapsule todo el ciclo de fetch a la API de productos.

### Tipo de retorno obligatorio (discriminated union)

```ts
// src/types/index.ts
type EstadoAsync<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
```

El hook devuelve `EstadoAsync<Producto[]>`.

### Comportamiento esperado

- Si `search` cambia, **cancela el fetch anterior** con `AbortController` antes de disparar uno nuevo
- Si el componente se desmonta durante un fetch, el fetch se cancela
- Un `AbortError` no se trata como error: simplemente se ignora

### Criterios de aceptación

- [ ] El hook está en `src/hooks/useProductos.ts`
- [ ] Usa `AbortController` dentro del `useEffect`
- [ ] El cleanup del `useEffect` llama a `controller.abort()`
- [ ] El componente que consume el hook **no tiene ningún `useState` ni `useEffect`** propio para los productos
- [ ] El componente maneja los 4 estados: `idle`, `loading`, `error`, `success`

```tsx
// Ejemplo de cómo debería verse el componente consumidor
function Home() {
  const [busqueda, setBusqueda] = useState("");
  const estado = useProductos({ search: busqueda });

  if (estado.status === "idle" || estado.status === "loading")
    return <Spinner />;
  if (estado.status === "error") return <p>Error: {estado.error}</p>;

  return <GrillaProductos productos={estado.data} />;
}
```

### Tip

> Con la discriminated union, TypeScript sabe exactamente qué propiedades existen en cada rama del `if`. Si accedés a `estado.data` sin verificar que `status === 'success'`, TypeScript te va a frenar. Eso es intencional.

---

---

# 🎫 TICKET 04 — Context API: Carrito

**Concepto:** Context API · proveedor con acciones · puerta única de acceso

### Qué tenés que construir

El carrito de la tienda como **feature aislada**: un `CarritoProvider` que exponga las acciones y valores derivados, y un hook `useCarrito` como única puerta de acceso.

### Qué tiene que tener el carrito

```ts
type CarritoContextValue = {
  items: ProductoEnCarrito[];
  agregarItem: (producto: Producto) => void;
  quitarItem: (productoId: number) => void;
  cambiarCantidad: (productoId: number, cantidad: number) => void;
  vaciarCarrito: () => void;
  totalItems: number; // calculado, no guardado
  totalPrecio: number; // calculado, no guardado
};
```

### Reglas de negocio

- Si agregás un producto que ya existe → incrementa `cantidad` en 1
- Si `cambiarCantidad` recibe `cantidad <= 0` → elimina el item
- `totalItems` es la **suma de cantidades** (no cantidad de productos únicos)
- `totalPrecio` es `price * cantidad` por cada item, sumados

### Archivo por archivo

**`src/features/carrito/CarritoContext.tsx`**

- Crea el contexto con `createContext<CarritoContextValue | undefined>(undefined)`
- Implementa el `CarritoProvider`
- Usa `useLocalStorage` del Ticket 02 para persistir `items`
- Envuelve todas las acciones en `useCallback`
- Calcula `totalItems` y `totalPrecio` con `useMemo`
- Memoiza el `value` completo con `useMemo`

**`src/features/carrito/useCarrito.ts`**

- Solo tiene un `useContext` + un guard clause
- Si el contexto es `undefined`, lanza un `Error` con un mensaje descriptivo

### Criterios de aceptación

- [ ] El carrito persiste al refrescar (usa `useLocalStorage`)
- [ ] Los componentes consumidores solo importan `useCarrito`, nunca `CarritoContext` directamente
- [ ] `agregarItem`, `quitarItem`, `cambiarCantidad` y `vaciarCarrito` están en `useCallback`
- [ ] `totalItems` y `totalPrecio` están en `useMemo`
- [ ] Si usás `useCarrito` fuera de `CarritoProvider`, la app lanza un error con mensaje claro
- [ ] En `main.tsx`, `CarritoProvider` envuelve a `App`

### Pregunta de reflexión para la defensa

> "¿Por qué `useCarrito` es una función separada en vez de exportar el contexto y usar `useContext` directo en cada componente?"  
> La respuesta corta: porque si mañana migramos a Zustand, solo tocamos `useCarrito.ts`. Los 15 componentes que lo consumen no se tocan.

---

---

# 🎫 TICKET 05 — `useMemo` en filtros y derivados

**Concepto:** useMemo · cuándo tiene sentido usarlo · filtrado de listas

### El problema

La grilla de productos tiene:

1. Una lista de productos que llegan de la API (puede ser grande)
2. Un filtro de categoría seleccionado
3. Un orden seleccionado (precio asc/desc, nombre)

Cada vez que cualquier cosa re-renderiza (incluso el carrito actualizándose), el filtrado y orden se recalculan. Con 100 productos eso puede ser costoso.

### Qué tenés que hacer

1. En `Home.tsx`, tenés el array de productos, una categoría seleccionada y un orden seleccionado como estado local.

2. Extraé el filtrado y orden a una variable con `useMemo`:

```ts
const productosFiltrados = useMemo(() => {
  // 1. Filtrá por categoría (si hay una seleccionada)
  // 2. Ordená según el criterio seleccionado
  // 3. Retorná el array resultante
}, [productos, categoriaSeleccionada, orden]);
```

3. Pasá `productosFiltrados` a la `GrillaProductos`, no el array original.

### Categorías disponibles en dummyjson

Podés obtenerlas dinámicamente del array de productos:

```ts
const categorias = useMemo(
  () => ["todas", ...new Set(productos.map((p) => p.category))],
  [productos],
);
```

### Criterios de aceptación

- [ ] `productosFiltrados` usa `useMemo` con las dependencias correctas
- [ ] `categorias` usa `useMemo` para no recalcular el `Set` en cada render
- [ ] Si `categoriaSeleccionada === 'todas'`, muestra todos los productos
- [ ] El cambio de categoría se refleja inmediatamente en la grilla
- [ ] **No usás `useMemo` para cosas triviales** como `const titulo = \`Carrito (\${totalItems})\``

### Para pensar

¿Cuándo **no** tiene sentido usar `useMemo`?

- Cuando el cálculo es trivial (una suma, un template string)
- Cuando el componente casi nunca re-renderiza
- Cuando estás en un prototipo y todavía no mediste nada

`useMemo` tiene un costo propio (guardar el valor anterior, comparar dependencias). Si el cálculo que envolvés es más barato que ese overhead, `useMemo` empeora la performance.

---

---

# 🎫 TICKET 06 — `useCallback` + React.memo con evidencia

**Concepto:** useCallback · React.memo · flujo correcto de optimización

### Contexto

Ahora que `CarritoProvider` pasa funciones como `agregarItem` a través del contexto, esas funciones llegan a `ProductCard` como props. Si `ProductCard` no está memoizada, va a re-renderizar cada vez que el contexto cambie, aunque el producto específico de esa card no haya cambiado.

### Paso 1 — Medir primero (baseline)

Antes de tocar una sola línea de código:

1. Abrí DevTools → **Profiler**
2. Hacé click en grabar (círculo rojo)
3. Agregá 3 productos al carrito rápidamente
4. Detené la grabación
5. Anotá cuántas veces re-renderizó `ProductCard` y cuánto tardó cada render

**Guardá una captura de pantalla del Profiler** — la vas a necesitar para justificar la optimización.

### Paso 2 — Aplicar la optimización

Envolvé `ProductCard` en `React.memo`:

```tsx
// components/ProductCard.tsx
const ProductCard = React.memo(function ProductCard({
  producto,
  onAgregar,
}: Props) {
  // ...
});
```

Para que `React.memo` funcione, la prop `onAgregar` (que viene de `useCarrito`) tiene que ser una referencia **estable**. Verificá que `agregarItem` en `CarritoContext.tsx` está envuelta en `useCallback` (lo hiciste en el Ticket 04).

### Paso 3 — Medir de nuevo

Repetí exactamente la misma acción del Paso 1 y compará los resultados.

### Criterios de aceptación

- [ ] `ProductCard` está envuelta en `React.memo`
- [ ] `agregarItem` (y demás acciones del carrito) están en `useCallback`
- [ ] Tenés **dos capturas del Profiler**: antes y después
- [ ] En el README del proyecto (o en un comentario en el código) describís brevemente qué problema había y qué mejoró

### ⚠️ Trampa común

```tsx
// ❌ Esto rompe React.memo aunque usés useCallback
<ProductCard
  onAgregar={() => agregarItem(producto)}  // ← función nueva en cada render
  ...
/>

// ✅ Pasá la función directamente o usá useCallback para el wrapper también
const handleAgregar = useCallback(() => agregarItem(producto), [agregarItem, producto])
<ProductCard onAgregar={handleAgregar} ... />
```

---

---

# 🎯 BONUS — `useDebounce`

**Concepto:** Custom hook de timing · evitar requests innecesarios

### El problema

Cuando el usuario tipea en el buscador, `useProductos` dispara un fetch por **cada tecla presionada**. Con AbortController cancelamos los anteriores, pero igual generamos tráfico innecesario.

Un `useDebounce` retrasa la actualización de un valor hasta que el usuario deja de tipear por X milisegundos.

### Qué tenés que construir

```ts
// src/hooks/useDebounce.ts
// Entra: value (T) + delay en ms (número)
// Sale: el mismo value, pero actualizado solo después de `delay` ms sin cambios
// Invariante: siempre devuelve un valor del mismo tipo que recibe
```

### Uso esperado

```ts
const [busqueda, setBusqueda] = useState("");
const busquedaDebounced = useDebounce(busqueda, 400);

// Pasá busquedaDebounced (no busqueda) al hook de productos
const estado = useProductos({ search: busquedaDebounced });
```

### Criterios de aceptación

- [ ] El hook usa `useEffect` con un `setTimeout` + cleanup con `clearTimeout`
- [ ] El delay es un parámetro, no hardcodeado
- [ ] El buscador en pantalla se actualiza instantáneamente (controlado por `busqueda`)
- [ ] El fetch se dispara solo después de que el usuario deja de tipear 400ms
- [ ] Probás que funciona: tipear rápido "smartphone" genera un solo fetch, no 10

---

---

## 📋 Checklist final de entrega

### Funcionalidad

- [ ] Los productos se cargan desde `dummyjson.com`
- [ ] El buscador filtra productos (con debounce si hiciste el bonus)
- [ ] El filtro de categoría funciona
- [ ] Se puede agregar y quitar productos del carrito
- [ ] Se puede cambiar la cantidad desde el carrito
- [ ] El botón "Vaciar carrito" funciona
- [ ] El carrito persiste al refrescar la página
- [ ] Si el storage está corrupto, la app funciona igual

### Código

- [ ] Cero `any` (ESLint lo confirma con `npm run lint`)
- [ ] Cero `useState` / `useEffect` embebidos en componentes que también tienen JSX complejo
- [ ] `npm run build` pasa sin errores ni warnings
- [ ] El carrito vive en `features/carrito/` y se consume solo a través de `useCarrito`
- [ ] `useLocalStorage`, `useToggle`, `useProductos` están en `hooks/`

### Optimización (Ticket 06)

- [ ] Dos capturas del React Profiler (antes y después)
- [ ] Descripción breve de qué problema había y qué aplicaste

### Entrega

- [ ] Repositorio público en GitHub
- [ ] Commits convencionales (`feat:`, `fix:`, `refactor:`)
- [ ] `README.md` con instrucciones para correr el proyecto localmente
- [ ] Sección `## Decisiones técnicas` en el README explicando al menos 2 decisiones no triviales
- [ ] Sección `## Uso de IA` describiendo cómo usaste IA si la usaste

---

## 🔍 Preguntas de defensa

Vas a tener que responder al menos 2 de estas sin mirar notas:

1. ¿Por qué `useCallback` con `[]` como dependencias para `activar` y `desactivar` en `useToggle`?
2. ¿Qué pasa si el JSON en localStorage está corrupto y no manejás el error?
3. ¿Por qué usamos `AbortController` en lugar de solo un flag `let activo = true`?
4. ¿Por qué `useCarrito` en vez de exportar el contexto y usar `useContext` directo?
5. ¿Cuándo tiene sentido usar `useMemo` y cuándo es overhead innecesario?
6. ¿Por qué `React.memo` solo funciona si las funciones que pasás como props son referencias estables?
7. Si migrás el carrito a Zustand la semana que viene, ¿cuántos archivos tenés que tocar?

---

## 📎 Recursos

- [API de productos](https://dummyjson.com/products) — `GET /products?limit=20&skip=0`
- [API con búsqueda](https://dummyjson.com/products/search?q=laptop)
- [React Profiler — Docs oficiales](https://react.dev/reference/react/Profiler)
- [AbortController — MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [useMemo — Cuándo usarlo](https://react.dev/reference/react/useMemo#should-you-add-usememo-everywhere)
