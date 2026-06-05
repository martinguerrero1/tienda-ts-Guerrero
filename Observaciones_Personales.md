Ajustes que me recomendó la IA:
------------------------
//useProductos.ts

1. Validar response.ok, no solo data.

``if (!response.ok) {
  throw new Error("Hubo un error en la carga de los productos");
}``

2. Manejar búsquedas vacías con trim().

Si search = " ", hoy entra al endpoint de búsqueda igual. Podés pensar en usar búsqueda solo si hay texto real.

------------------------

