# 📊 Evaluación — Proyecto Madre

> Cómo te corrigen. Transparente a propósito: sabés exactamente contra qué
> te miden. No hay sorpresas, hay estándar.

---

## Filosofía

No evaluamos "que funcione". Una app que funciona con código que no podés
explicar, lleno de `any` y con commits "update" **no aprueba**. Evaluamos lo
que la consultora necesita: **criterio, calidad y autonomía real**.

---

## Rúbrica semanal (cada entrega)

| Dimensión | Peso | Qué miramos |
|---|---|---|
| **Funcionalidad** | 25% | ¿Hace lo que pide el ticket? ¿Casos borde? |
| **Tipado** | 25% | Cero `any`. Tipos derivados, no duplicados. Fronteras tipadas. |
| **Tooling & commits** | 20% | Husky bloquea de verdad. Commits convencionales con historia. |
| **Arquitectura** | 15% | Estructura predecible. Features aisladas. Pensado para migrar. |
| **Defensa ("defendé tu código")** | 15% | Explicás cualquier archivo sin notas. |

> La **defensa** puede vetar el resto: si no podés explicar tu propio código,
> no importa que funcione. Es el corazón del módulo.

---

## Escala

| Nivel | Significa |
|---|---|
| **Excelente** | Cumple todo + decisiones justificadas + defensa sólida. Nivel contratable. |
| **Aprobado** | Cumple los criterios de aceptación, tipado limpio, defensa correcta. |
| **A revisar** | Funciona pero hay `any`, commits pobres, o no puede explicar partes. |
| **No cumple** | No cumple criterios de aceptación, o no puede defender el código. |

---

## Banderas rojas (bajan la nota aunque "funcione")

- 🚩 Aparece `any` (significa que ESLint no está bien configurado o lo ignoró).
- 🚩 Tipos duplicados en vez de derivados (`Pick`/`Omit`/`Partial`).
- 🚩 Commits tipo "update", "wip", "cambios".
- 🚩 Husky no bloquea nada (tooling decorativo).
- 🚩 No puede explicar código que entregó → se asume copiado sin entender.
- 🚩 Falta la sección `## Uso de IA` en la entrega.
- 🚩 El proyecto se "reinició" en vez de crecer (historial roto).

## Banderas verdes (suman)

- ✅ Tipos derivados de una fuente única.
- ✅ Decisiones justificadas en commits/PR ("elegí X porque Y").
- ✅ Historial de commits que cuenta la evolución del producto.
- ✅ Sección `## Uso de IA` honesta: qué generó y **qué corrigió**.
- ✅ Casos borde manejados sin que se los pidan explícitamente.
- ✅ Defensa fluida: explica trade-offs, no solo "qué hace".

---

## Sobre la defensa oral

En cada clase, al azar, se abre el repo de algunos alumnos y se pregunta:

- *"¿Por qué este tipo está acá y no derivado?"*
- *"Mostrame dónde tu tooling rechazaría un `any`."*
- *"Este código te lo dio la IA — explicame esta línea."*
- *"¿Por qué elegiste esta estructura de carpetas?"*

No se busca que sepas todo de memoria. Se busca que **entiendas lo que entregaste**.
Esa es, literalmente, la diferencia entre un curso de teoría y lo que hacemos acá.

---

## Entrega: formato

Cada semana, en el README de tu repo (o en el PR), agregás:

```markdown
## Entrega Semana X

### Qué hice
- ...

### Decisiones
- Elegí ... porque ...

### Uso de IA
- Generé con IA: ...
- Lo que la IA hizo mal y corregí: ...

### Pendiente / sé que falta
- ...
```

> La sección "sé que falta" suma, no resta. Reconocer deuda técnica con
> conciencia es señal de criterio profesional.
