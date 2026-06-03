# 📐 Buenas Prácticas — Estándar Obligatorio

> Esto **no es opcional**. Es la vara de calidad. La rúbrica (`EVALUACION.md`)
> mide contra esto. Leelo antes de escribir la primera línea.

---

## 1. Estructura de carpetas

No hay una única estructura correcta, pero la tuya tiene que ser **predecible y
justificable**. Estándar recomendado para este proyecto:

```
src/
├── main.tsx
├── App.tsx
├── routes/            ← configuración de rutas
├── pages/             ← una carpeta por pantalla (Catalogo, Detalle, Carrito)
├── components/        ← componentes reutilizables (Button, Card, Layout)
├── features/          ← lógica por dominio (carrito, productos)
├── hooks/             ← custom hooks (a partir de la semana 3)
├── services/          ← capa de datos / API (a partir de la semana 4)
├── types/             ← tipos del dominio (Producto, Carrito, etc.)
└── lib/               ← utilidades genéricas
```

Regla: **si no sabés en qué carpeta va un archivo, tu estructura está mal pensada.**

---

## 2. TypeScript

- `strict: true` en `tsconfig.json`. Siempre. No se discute.
- **Cero `any`.** Forzado por ESLint (`@typescript-eslint/no-explicit-any: error`).
  Si no sabés el tipo: `unknown` + narrowing, nunca `any`.
- **Un tipo fuente de verdad por entidad.** `Producto` se define UNA vez en
  `types/`. Lo demás se deriva con utility types (`Pick`, `Omit`, `Partial`).
- Tipá las **fronteras**: props, retornos de funciones de servicio, respuestas de API.
- Dejá que TS **infiera** lo obvio (no tipes `const x = 0` como `: number`).

---

## 3. Componentes

- Un componente = una responsabilidad. Si pasa de ~150 líneas, probablemente
  hay que partirlo.
- Props tipadas con `interface`. `children` con `ReactNode`.
- Nada de lógica de negocio dentro del JSX. Esa lógica va a hooks/servicios.
- Nombres descriptivos: `ProductCard`, no `Card2` ni `Comp`.

---

## 4. Commits — Conventional Commits (forzado por commitlint)

Formato: `tipo(scope opcional): descripción en minúscula`

| Tipo | Cuándo |
|---|---|
| `feat` | nueva funcionalidad |
| `fix` | corrección de bug |
| `refactor` | cambio interno sin cambiar comportamiento |
| `chore` | tooling, configs, deps |
| `style` | formato (no lógica) |
| `test` | tests |
| `docs` | documentación |

Ejemplos buenos:

```
chore: project setup con vite + ts + tailwind
feat: catálogo de productos con datos estáticos tipados
refactor: extraer lógica de carrito a custom hook
fix: el total del carrito no contemplaba cantidad
```

Ejemplos que **commitlint va a rechazar**:

```
arregle cosas
WIP
Update App.tsx
Cambios varios
```

> El historial de commits **cuenta la historia del proyecto**. Un buen historial
> es parte de la nota. "Update" 40 veces no es un historial, es ruido.

---

## 5. Tooling de calidad (configuración de la Semana 2)

Esto tiene que estar funcionando **en el primer commit**. Pasos:

### 5.1 Instalar

```bash
npm i -D eslint prettier eslint-config-prettier \
        @typescript-eslint/parser @typescript-eslint/eslint-plugin \
        husky lint-staged @commitlint/cli @commitlint/config-conventional
```

### 5.2 Regla estrella de ESLint

```jsonc
// .eslintrc (o eslint.config.js)
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

### 5.3 commitlint

```js
// commitlint.config.js
export default { extends: ["@commitlint/config-conventional"] };
```

### 5.4 Husky + lint-staged

```bash
npx husky init
```

```jsonc
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

```bash
# .husky/pre-commit
npx lint-staged

# .husky/commit-msg
npx --no-install commitlint --edit "$1"
```

### 5.5 Verificación de que funciona

Probá a propósito:

1. Escribí `const x: any = 1;` → `git commit` debe **abortar**.
2. Commiteá con mensaje `"prueba"` → debe **abortar** (no es conventional).

Si ninguna de las dos aborta, tu tooling **no está funcionando** y el ticket de
fundación **no está completo**, aunque la app ande.

---

## 6. La IA — cómo se usa acá

✅ **Permitido / esperado:**
- Generar boilerplate, configs, tipos a partir de un JSON.
- Pedir que explique un error.
- Pedir refactors y evaluarlos críticamente.

❌ **No permitido:**
- Entregar código que no podés explicar línea por línea.
- Dejar el `any` que la IA metió "porque andaba".
- Copiar arquitectura sin entender por qué.

**Obligatorio:** en el PR/entrega semanal, una sección
`## Uso de IA` con: qué generaste con IA, y **qué corregiste de lo que te dio**.

---

## 7. Checklist de calidad (autoevaluación antes de entregar)

- [ ] `tsconfig` con `strict: true`.
- [ ] `npm run build` / `typecheck` sin errores.
- [ ] Cero `any` (ESLint lo confirma).
- [ ] Husky aborta commits con `any` y con mensajes no convencionales.
- [ ] Estructura de carpetas predecible.
- [ ] Commits convencionales y con historia coherente.
- [ ] Sección `## Uso de IA` en la entrega.
- [ ] Puedo defender cualquier archivo del repo sin notas.
