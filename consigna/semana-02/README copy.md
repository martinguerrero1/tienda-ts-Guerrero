# 🛒 Proyecto Madre — "TiendaTS" (E-commerce con catálogo y carrito)

> **Módulo 2 · Full Stack Developer**
> Proyecto **individual** · arranca en la **Semana 2** · se arrastra **5 semanas** hasta el cierre del módulo.

---

## ⚠️ Leé esto primero

Esto **no es un tutorial**. No hay repo base, no hay paso a paso, no hay "copiá esto acá".

Tenés: **el producto a construir, los tickets de cada semana, el estándar de calidad y la rúbrica.**
El **cómo** lo resolvés vos — como en un trabajo real, donde te dan el _qué_ y los _criterios_, no el _cómo_.

Esto es exactamente lo que la consultora busca: que sepas, que tengas la experiencia, y que uses la IA como herramienta — no como muleta.

---

## 🎯 El producto

**TiendaTS** es un e-commerce de catálogo con carrito. Versión final (semana 6) tiene que permitir:

- Ver un **catálogo de productos** (desde una API real).
- **Filtrar / buscar** productos.
- Ver el **detalle** de un producto.
- Agregar y quitar productos de un **carrito**.
- Ver el **total** y la cantidad de ítems del carrito.
- Un **checkout** simulado (formulario validado, sin pago real).
- Estar **testeado** (unitario + 1 flujo E2E) y con buenas prácticas desde el commit 1.

La API de datos es pública y gratuita: **DummyJSON** → `https://dummyjson.com/products`
(no requiere API key).

---

## 🧱 Stack obligatorio

| Capa | Tecnología | Desde |
|---|---|---|
| Build | Vite | Semana 2 |
| UI | React 18+ | Semana 2 |
| Lenguaje | TypeScript (`strict: true`) | Semana 2 |
| Estilos | TailwindCSS | Semana 2 |
| Ruteo | React Router | Semana 2 |
| Estado global | Context → Zustand → Redux Toolkit | Semanas 3-4 |
| Data fetching | Axios → TanStack Query | Semanas 4-5 |
| Carga | Suspense + ErrorBoundary | Semana 5 |
| Testing | Vitest + RTL + Cypress | Semana 6 |
| Calidad | ESLint + Prettier + Husky + lint-staged + commitlint | **Semana 2 (día 1)** |

> El stack **evoluciona** a propósito: vas a migrar de Context a Zustand a Redux, de fetch
> a Axios a TanStack Query. Esto es deliberado: vas a sentir en el cuerpo por qué existe
> cada herramienta. No es retrabajo, es aprendizaje.

---

## 📅 Hoja de ruta (qué entregás cada semana)

| Semana | Foco | Entregable |
|---|---|---|
| **2** | Fundación + TS | Proyecto inicializado, tipado, tooling funcionando, catálogo estático tipado |
| **3** | Hooks + estado local | Custom hooks, carrito con Context, optimización medida |
| **4** | Estado global + datos | Migrar a Zustand/Redux, Axios, datos reales de la API |
| **5** | Data moderno + UI | TanStack Query, Suspense, librería de UI, búsqueda/filtros |
| **6** | Testing + cierre | Tests unitarios + 1 E2E, checkout, entrega final + defensa |

> Cada semana tiene sus **tickets** en `tickets/`. Esta semana hacés los de la Semana 2.
> Las siguientes están esbozadas para que veas hacia dónde vas (se detallan en su clase).

---

## 📂 Qué hay en este spec

```
proyecto-ecommerce-spec/
├── README.md              ← Estás acá. El producto, stack y hoja de ruta.
├── BUENAS-PRACTICAS.md    ← El estándar de calidad OBLIGATORIO.
├── EVALUACION.md          ← La rúbrica con la que te corrigen.
└── tickets/
    ├── SEMANA-02.md       ← Lo que entregás esta semana (detallado).
    └── BACKLOG.md         ← Semanas 3-6 esbozadas (la visión completa).
```

---

## 🚦 Cómo arrancar (sin que te demos el repo)

1. Creá tu repo propio en GitHub: `tienda-ts-<tu-apellido>`.
2. Leé `BUENAS-PRACTICAS.md` **antes de escribir código**.
3. Leé `tickets/SEMANA-02.md`: son tus tickets de esta semana.
4. Leé `EVALUACION.md`: así sabés exactamente cómo te miran.
5. Primer commit: `chore: project setup` con tooling ya funcionando.

> 💡 El primer commit ya tiene que tener Husky funcionando. Si tu primer commit
> es código sin tooling, ya arrancaste con deuda. La fundación es parte del ticket.

---

## ❓ Reglas del juego

- **Individual.** Podés consultar con compañeros, pero el repo y la defensa son tuyos.
- **IA permitida, explicación obligatoria.** Podés generar con IA. En la defensa
  te van a pedir que expliques cualquier línea. _Solo entregás lo que podés explicar._
- **Conventional commits desde el commit 1.** No negociable. Está forzado por commitlint.
- **Cero `any`.** Está forzado por ESLint. No es una sugerencia.
- **El proyecto crece, no se reinicia.** Mismo repo toda la cursada. El historial
  de commits es parte de lo que se evalúa (cuenta una historia).
