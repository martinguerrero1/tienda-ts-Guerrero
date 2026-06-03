# 🪝 Semana 3 — Custom Hooks + Carrito + Optimización

> **Módulo 2 · Full Stack Developer** — React · TypeScript · TailwindCSS
> Duración: 1 día intensivo · **Teoría integrada con live coding.**

---

## 🎯 Objetivo de la clase

Sacar la lógica de los componentes, construir el carrito de forma aislada y medir antes de optimizar.

Al terminar, tenés que poder:

1. Crear **custom hooks tipados** con un contrato claro (inputs, outputs, invariantes).
2. Implementar un **carrito con Context API** preparado para migrar a Zustand/Redux.
3. Persistir estado en **localStorage** con un hook genérico reusable.
4. Justificar una **optimización con evidencia** del React Profiler.

> ⚠️ **Regla de esta semana:** el carrito tiene que quedar como **feature aislada**. Si cada componente sabe demasiado del carrito, Semana 4 va a doler. Si lo encapsulás bien, migrar es cambiar 1 archivo.

# 📚 PARTE TEÓRICA

---

## 1. Custom Hooks tipados

### El problema que resuelven

Los componentes de React mezclan dos responsabilidades que no deberían ir juntas: **renderizado** y **lógica de negocio**. Cuando un componente crece, la lógica embebida en el JSX lo vuelve difícil de leer, testear y reutilizar.

```tsx
// ❌ Antes: lógica embebida en el componente
function Catalogo() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtroAbierto, setFiltroAbierto] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://dummyjson.com/products")
      .then((r) => r.json())
      .then((data) => {
        setProductos(data.products);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudieron cargar los productos");
        setLoading(false);
      });
  }, []);

  // 80 líneas más de JSX...
}
```

El componente sabe **cómo** traer datos, **cómo** manejar estado del filtro, y **cómo** renderizar. Eso es demasiado.

```tsx
// ✅ Después: componente declarativo
function Catalogo() {
  const estado = useProductos();
  const { value: filtroAbierto, toggle: toggleFiltro } = useToggle();

  if (estado.status === "loading") return <Spinner />;
  if (estado.status === "error") return <ErrorMessage mensaje={estado.error} />;

  return (
    <>
      <button onClick={toggleFiltro}>Filtros</button>
      {filtroAbierto && <PanelFiltros />}
      <GrillaProductos productos={estado.data} />
    </>
  );
}
```

El componente ahora solo **declara qué mostrar**. El cómo vive en los hooks.

---

### Regla para decidir qué extraer

Tres señales claras de que algo debería ser un hook:

1. **El mismo bloque de estado + lógica aparece en más de un componente.**
2. **La lógica ensucia el JSX** y dificulta leer el render.
3. **Quiero testear la lógica sin montar el componente.**

> 💡 Un hook es simplemente **una función que empieza con `use`** y puede llamar otros hooks. No es magia: es encapsulamiento.

---

### Diseñar el contrato del hook

Antes de escribir el hook, definí su contrato:

- **¿Qué entra?** (parámetros)
- **¿Qué sale?** (tipo de retorno)
- **¿Qué invariante garantizo?** (promesas que nunca se rompen)

```ts
// Contrato de useToggle:
// Entra: valor inicial (opcional, default false)
// Sale: value actual + 4 acciones
// Invariante: value siempre es boolean, las acciones nunca cambian de referencia
```

---

### `useToggle` — hook de UI reutilizable

El caso más simple. Un booleano con acciones con nombre.

```ts
// ejemplos/hooks/useToggle.ts
import { useCallback, useState } from "react";

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const activar = useCallback(() => setValue(true), []);
  const desactivar = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((prev) => !prev), []);

  return { value, activar, desactivar, toggle };
}
```

```tsx
// Uso en componente — mucho más legible que useState(false) disperso
const {
  value: modalAbierto,
  activar: abrirModal,
  desactivar: cerrarModal,
} = useToggle();
const { value: filtroVisible, toggle: toggleFiltro } = useToggle();
```

> ⚠️ **Por qué `useCallback`?** Para que `activar`, `desactivar` y `toggle` sean referencias estables. Si las pasás como props a componentes hijos con `React.memo`, esto evita re-renders innecesarios. Ya lo vamos a usar en el Ticket 4.

---

### `useProductos` — hook de carga tipado

Este hook encapsula el ciclo completo de un fetch: estados, error, y cleanup.

Primero, el tipo de estado. Este patrón se llama **discriminated union**: cada variante de `status` habilita propiedades específicas. Es imposible tener `data` y `error` al mismo tiempo.

```ts
// ejemplos/types.ts
type EstadoAsync<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
```

```ts
// ejemplos/hooks/useProductos.ts
import { useEffect, useState } from "react";
import type { EstadoAsync, Producto } from "../types";

export function useProductos() {
  const [estado, setEstado] = useState<EstadoAsync<Producto[]>>({
    status: "idle",
  });

  useEffect(() => {
    let activo = true; // evita actualizar state si el componente se desmontó

    const cargar = async () => {
      setEstado({ status: "loading" });
      try {
        const response = await fetch("https://dummyjson.com/products");
        if (!response.ok) throw new Error("No se pudieron obtener productos");
        const data: { products: Producto[] } = await response.json();
        if (activo) setEstado({ status: "success", data: data.products });
      } catch (error) {
        if (activo) {
          setEstado({
            status: "error",
            error: error instanceof Error ? error.message : "Error desconocido",
          });
        }
      }
    };

    void cargar();

    return () => {
      activo = false;
    }; // cleanup: cancela actualización si se desmonta
  }, []);

  return estado;
}
```

```tsx
// Componente que lo consume: sin un solo useState ni useEffect visible
function Catalogo() {
  const estado = useProductos();

  if (estado.status === "idle" || estado.status === "loading") {
    return <p>Cargando...</p>;
  }
  if (estado.status === "error") {
    return <p>Error: {estado.error}</p>;
  }
  // TS sabe que acá status === "success" y que estado.data existe
  return <GrillaProductos productos={estado.data} />;
}
```

> 💡 **`switch` exhaustivo:** si agregás un 5° estado al union type y no actualizás el componente, TypeScript va a marcar error. Esa es la red de seguridad de los discriminated unions.

---

### `useProductos` con AbortController — cancelar fetches de verdad

El hook anterior usa una variable `activo` para evitar actualizar estado cuando el componente se desmontó. Funciona, pero tiene un problema: **el request de red sigue viajando igual** aunque ya no lo necesitemos. En producción eso consume ancho de banda y puede generar efectos raros en escenarios de navegación rápida.

`AbortController` es la solución nativa del browser para **cancelar un fetch en vuelo**.

#### ¿Qué problema resuelve exactamente?

```
Usuario entra a /catalogo → se dispara fetch → usuario navega a /detalle en 200ms
→ el fetch de catálogo termina igual → intenta actualizar estado de un componente desmontado
→ React warning, posible bug silencioso
```

Con AbortController: cuando el componente se desmonta, le decimos al browser "cancelá ese request". Si la respuesta llega igual (ya venía en camino), `fetch` tira un `AbortError` que ignoramos explícitamente.

---

#### El hook completo con AbortController

```ts
// ejemplos/hooks/useProductosAbort.ts
import { useEffect, useState } from "react";
import type { EstadoAsync, Producto } from "../types";

export function useProductosAbort() {
  const [estado, setEstado] = useState<EstadoAsync<Producto[]>>({
    status: "idle",
  });

  useEffect(() => {
    // 1. Creamos el controlador — es el "interruptor" del fetch
    const controller = new AbortController();

    const cargar = async () => {
      setEstado({ status: "loading" });
      try {
        // 2. Pasamos la señal al fetch — ahora están conectados
        const response = await fetch("https://dummyjson.com/products", {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("No se pudieron obtener productos");

        const data: { products: Producto[] } = await response.json();
        setEstado({ status: "success", data: data.products });

      } catch (error) {
        // 3. AbortError es esperado cuando el componente se desmonta → lo ignoramos
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setEstado({
          status: "error",
          error: error instanceof Error ? error.message : "Error desconocido",
        });
      }
    };

    void cargar();

    // 4. Cleanup: cuando el componente se desmonta, cancelamos el request en vuelo
    return () => {
      controller.abort();
    };
  }, []);

  return estado;
}
```

#### Diferencia visual con la versión anterior

```ts
// ❌ Versión con flag booleano: request sigue viajando, solo ignoramos la respuesta
return () => { activo = false; };

// ✅ Versión con AbortController: el request se cancela en la red
return () => { controller.abort(); };
```

#### ¿Cuándo usar cuál?

| Situación | Recomendación |
|---|---|
| Fetch simple, componente estable | `let activo = true` alcanza |
| Navegación rápida, muchos remounts | `AbortController` |
| Search/autocomplete (keypress → fetch) | `AbortController` obligatorio |
| Cualquier fetch que dependa de parámetros que cambian | `AbortController` |

#### Bonus: AbortController con dependencias cambiantes

El caso más común en producción: un input de búsqueda que dispara un fetch por cada cambio.

```ts
// Si el usuario tipea rápido: "m" → "mo" → "mou" → "mous" → "mouse"
// Sin AbortController: 5 requests en vuelo, llegan en orden arbitrario → estado inconsistente
// Con AbortController: cada nuevo render cancela el request anterior

export function useBusqueda(query: string) {
  const [estado, setEstado] = useState<EstadoAsync<Producto[]>>({ status: "idle" });

  useEffect(() => {
    if (!query.trim()) {
      setEstado({ status: "idle" });
      return;
    }

    const controller = new AbortController();

    const buscar = async () => {
      setEstado({ status: "loading" });
      try {
        const response = await fetch(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Error en la búsqueda");
        const data: { products: Producto[] } = await response.json();
        setEstado({ status: "success", data: data.products });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setEstado({
          status: "error",
          error: error instanceof Error ? error.message : "Error",
        });
      }
    };

    void buscar();

    // Cada vez que query cambia, el efecto anterior hace cleanup → abort()
    // Y el nuevo efecto dispara un nuevo fetch con la query actualizada
    return () => { controller.abort(); };
  }, [query]); // ← query es la dependencia

  return estado;
}
```

```tsx
// Uso: el hook maneja toda la complejidad de cancelación
function BuscadorProductos() {
  const { value: query, toggle: _ } = useToggle(); // solo para demo
  const [busqueda, setBusqueda] = useState("");
  const estado = useBusqueda(busqueda);

  return (
    <div>
      <input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar productos..."
      />
      {estado.status === "loading" && <p>Buscando...</p>}
      {estado.status === "success" && <p>{estado.data.length} resultados</p>}
      {estado.status === "error" && <p>{estado.error}</p>}
    </div>
  );
}
```

> 💡 **Para la defensa:** si te preguntan "¿por qué usás AbortController?", la respuesta no es "porque es la mejor práctica". La respuesta es: "porque sin él, si el usuario navega rápido, puedo tener 3 requests en vuelo y el estado termina con los datos del que llegó último, no del que disparé último".

---

## 2. Context API + carrito preparado para migrar

### El problema con estado compartido sin estructura

Llega un punto donde el carrito necesita estar disponible en el header (para mostrar el contador), en las cards (para el botón "Agregar"), y en la página del carrito. Pasar props entre componentes no relacionados se vuelve imposible — eso se llama **prop drilling**.

```tsx
// ❌ Prop drilling: el estado viaja por componentes que no lo usan
<App carrito={carrito} setCarrito={setCarrito}>
  <Layout carrito={carrito} setCarrito={setCarrito}>
    <Header carrito={carrito} />
    <Catalogo setCarrito={setCarrito} />
  </Layout>
</App>
```

La solución es **Context API**: un canal que hace disponible un valor en cualquier nivel del árbol sin pasarlo explícitamente.

---

### Por qué diseñar el carrito para migrar

Semana 4 vamos a reemplazar Context por Zustand o Redux. Si cada componente consume `useContext(CarritoContext)` directamente, ese cambio afecta todos los archivos.

La solución: **una sola puerta de acceso** — `useCarrito()`. Los consumidores dependen de ese hook, no de la implementación interna. Cuando migres, solo cambiás ese archivo.

```tsx
// ❌ Sin puerta única: acoplado a la implementación
import { useContext } from "react";
import { CarritoContext } from "../features/carrito/CarritoContext";

function ProductCard({ producto }) {
  const { agregarItem } = useContext(CarritoContext); // si cambia el contexto, esto se rompe
}
```

```tsx
// ✅ Con puerta única: desacoplado
import { useCarrito } from "../features/carrito/useCarrito";

function ProductCard({ producto }) {
  const { agregarItem } = useCarrito(); // no importa cómo está implementado adentro
}
```

---

### Tipos del carrito

```ts
// ejemplos/types.ts
export interface Producto {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
}

// ProductoEnCarrito reutiliza Producto — no lo copia
export type ProductoEnCarrito = Producto & {
  cantidad: number;
};
```

---

### CarritoContext — provider con acciones y derivados

```tsx
// ejemplos/carrito/CarritoContext.tsx
import { createContext, useCallback, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Producto, ProductoEnCarrito } from "../types";

// 1. Definís el contrato completo del contexto
type CarritoContextValue = {
  items: ProductoEnCarrito[];
  agregarItem: (producto: Producto) => void;
  quitarItem: (productId: number) => void;
  cambiarCantidad: (productId: number, cantidad: number) => void;
  vaciarCarrito: () => void;
  totalItems: number; // derivado, no almacenado
  totalPrecio: number; // derivado, no almacenado
};

// 2. Creás el contexto sin valor inicial (undefined fuerza el guard en el hook)
export const CarritoContext = createContext<CarritoContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "carrito:v1"; // clave centralizada

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<ProductoEnCarrito[]>(
    STORAGE_KEY,
    [],
  );

  const agregarItem = useCallback(
    (producto: Producto) => {
      setItems((prev) => {
        const existente = prev.find((item) => item.id === producto.id);
        if (existente) {
          return prev.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item,
          );
        }
        return [...prev, { ...producto, cantidad: 1 }];
      });
    },
    [setItems],
  );

  const quitarItem = useCallback(
    (productId: number) => {
      setItems((prev) => prev.filter((item) => item.id !== productId));
    },
    [setItems],
  );

  const cambiarCantidad = useCallback(
    (productId: number, cantidad: number) => {
      if (cantidad <= 0) {
        setItems((prev) => prev.filter((item) => item.id !== productId));
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, cantidad } : item,
        ),
      );
    },
    [setItems],
  );

  const vaciarCarrito = useCallback(() => setItems([]), [setItems]);

  // 3. Valores derivados: se recalculan solo cuando items cambia
  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + item.cantidad, 0),
    [items],
  );

  const totalPrecio = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.cantidad, 0),
    [items],
  );

  // 4. El value también es memoizado para no re-renderizar todo el árbol
  const value = useMemo(
    () => ({
      items,
      agregarItem,
      quitarItem,
      cambiarCantidad,
      vaciarCarrito,
      totalItems,
      totalPrecio,
    }),
    [
      items,
      agregarItem,
      quitarItem,
      cambiarCantidad,
      vaciarCarrito,
      totalItems,
      totalPrecio,
    ],
  );

  return (
    <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>
  );
}
```

---

### `useCarrito` — la puerta única

```ts
// ejemplos/carrito/useCarrito.ts
import { useContext } from "react";
import { CarritoContext } from "./CarritoContext";

export function useCarrito() {
  const context = useContext(CarritoContext);

  // Guard clause: falla rápido con mensaje claro si se usa mal
  if (!context) {
    throw new Error(
      "useCarrito debe usarse dentro de CarritoProvider. " +
        "Asegurate de que CarritoProvider envuelva tu App o el componente que lo usa.",
    );
  }

  return context;
}
```

> ✅ **Qué le deja este diseño a Semana 4:** cuando migremos a Zustand, solo cambiamos `CarritoContext.tsx`. `useCarrito.ts` pasa a retornar el store de Zustand en vez del contexto. Todos los componentes consumidores **no se tocan**.

---

## 3. Persistencia con `useLocalStorage<T>`

### El problema

Cada vez que el usuario refresca, el carrito se vacía. Necesitamos guardar el estado en localStorage, pero haciéndolo de forma encapsulada y segura.

**Dos errores comunes:**

1. Poner el código de localStorage directo dentro del provider. Mezcla responsabilidades y no reutiliza.
2. No manejar el caso en que localStorage tiene un JSON corrupto o desactualizado. La app crashea en producción.

---

### `useLocalStorage<T>` — genérico y seguro

```ts
// ejemplos/hooks/useLocalStorage.ts
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    // Inicialización lazy: solo corre una vez al montar
    try {
      const raw = localStorage.getItem(key);
      // Si no hay nada guardado → valor inicial
      // Si hay algo → parseamos (puede fallar si está corrupto)
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      // JSON inválido, storage corrupto, permisos denegados → fallback seguro
      return initialValue;
    }
  });

  useEffect(() => {
    // Cada vez que value cambia, lo sincronizamos al storage
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  // Devuelve la misma API que useState: [value, setter]
  return [value, setValue] as [T, Dispatch<SetStateAction<T>>];
}
```

```ts
// Uso en CarritoProvider: igual que useState, pero persistido
const [items, setItems] = useLocalStorage<ProductoEnCarrito[]>(
  "carrito:v1",
  [],
);
```

> 💡 **Por qué `"carrito:v1"`?** Si en Semana 5 cambiás la forma del tipo `ProductoEnCarrito`, el storage viejo va a traer datos con formato incorrecto. Versionar la clave te permite migrar limpio: la nueva versión ignora el storage viejo y arranca de cero.

> ⚠️ **Cómo testear el fallback:** abrí DevTools → Application → Storage → Local Storage → editá manualmente el valor a `{roto` (JSON inválido) → recargá. La app debe funcionar sin crashear.

---

## 4. Optimización con evidencia — `useMemo` y `useCallback`

### El problema con optimizar sin medir

```tsx
// ❌ El error más común: "pongo useMemo en todos lados porque parece más rápido"
const nombre = useMemo(() => usuario.nombre.trim(), [usuario.nombre]);
// Esto no optimiza nada: trim() es O(n) mínimo, useMemo tiene overhead propio
```

`useMemo` y `useCallback` tienen un costo: React tiene que guardar el valor anterior, comparar las dependencias, y decidir si recalcular. Si el cálculo que envolvés es trivial, el overhead **supera el beneficio**.

**Regla:** medir primero con React Profiler, optimizar después.

---

### React Profiler — cómo usarlo

1. Abrí DevTools → pestaña **Profiler**.
2. Hacé click en el círculo rojo (grabar).
3. Ejecutá la acción que querés medir (ej. agregar 5 productos al carrito rápido).
4. Hacé click en Stop.
5. Revisá los flamegraphs: las barras anchas y amarillas son componentes que re-renderizaron mucho.

Lo que buscás detectar:

- Un componente re-renderiza aunque sus props **no cambiaron**.
- Un cálculo costoso corre en cada render aunque las dependencias sean las mismas.

---

### `useMemo` — memoizar un valor derivado costoso

```tsx
// ✅ Caso válido: el carrito puede tener muchos ítems, el cálculo recorre todo el array
const totalPrecio = useMemo(
  () => items.reduce((acc, item) => acc + item.price * item.cantidad, 0),
  [items], // solo recalcula cuando items cambia
);
```

```tsx
// ❌ Caso inválido: no vale la pena
const titulo = useMemo(() => `Carrito (${totalItems})`, [totalItems]);
// Mejor así:
const titulo = `Carrito (${totalItems})`;
```

---

### `useCallback` — memoizar una función para estabilizar referencia

En JavaScript, cada render crea una **nueva instancia** de cada función definida adentro. Eso hace que `funcionA === funcionA` sea `false` entre renders, aunque el código sea idéntico.

Eso importa cuando:

- La función se pasa como prop a un componente envuelto en `React.memo`.
- La función es dependencia de otro `useEffect` o `useMemo`.

```tsx
// ❌ Sin useCallback: nueva referencia en cada render → hijo re-renderiza
function CarritoProvider({ children }) {
  const [items, setItems] = useState([]);

  const agregarItem = (producto) => {
    // nueva función en cada render
    setItems((prev) => [...prev, producto]);
  };

  return <Ctx.Provider value={{ agregarItem }}>{children}</Ctx.Provider>;
}
```

```tsx
// ✅ Con useCallback: referencia estable → hijo no re-renderiza si no cambiaron deps
const agregarItem = useCallback(
  (producto: Producto) => {
    setItems((prev) => [...prev, producto]);
  },
  [setItems],
); // solo se recrea si setItems cambia (que nunca pasa)
```

---

### Flujo correcto de optimización

```
1. La app funciona correctamente  →  2. Tenés una queja de performance concreta
→  3. Medís con Profiler  →  4. Identificás el culpable con evidencia
→  5. Aplicás la optimización mínima  →  6. Re-medís para confirmar mejora
→  7. Documentás: qué problema había, qué aplicaste, qué mejoró
```

> 💡 **Para la defensa:** si no tenés el paso 3 (medición baseline) documentado, no podés justificar la optimización. La optimización por intuición no aprueba en este módulo.

---

## 5. Estructura de carpetas esperada esta semana

```
src/
├── features/
│   └── carrito/                  ← Feature aislada
│       ├── CarritoContext.tsx
│       └── useCarrito.ts
├── hooks/                        ← Hooks transversales
│   ├── useToggle.ts
│   ├── useProductos.ts
│   └── useLocalStorage.ts
├── types/
│   └── index.ts                  ← Tipos del dominio
└── ...
```

> Si el carrito no vive en su propia carpeta de feature, la arquitectura no está lista para Semana 4.

---

## 📋 Checklist de salida

- [ ] `npm run build` sin errores ni warnings.
- [ ] Cero `any` (ESLint lo confirma).
- [ ] Carrito en `features/carrito/`, consumido solo mediante `useCarrito`.
- [ ] Refresh conserva el carrito.
- [ ] Storage corrupto → app funciona igual.
- [ ] 1 optimización con baseline documentado.
- [ ] Commits convencionales del día.
- [ ] Sección `## Uso de IA` en la entrega.
- [ ] Puedo explicar cada decisión sin notas.
