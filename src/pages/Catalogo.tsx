import ProductoCard from "../components/ProductoCard";
import useProductos from "../hooks/useProductos";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import { useMemo, useState } from "react";
import type { Producto } from "../types/producto";

function Catalogo() {
  //filtros
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");

  const estadoProductos = useProductos({ search: busqueda });
  const productos =
    estadoProductos.status === "success" ? estadoProductos.data : [];

  //useMemo
  const productosFiltrados: Producto[] = useMemo(() => {
    //useMemo para que "guarde" este valor a no ser que cambie una de las dependencias

    const filtroCategoria = productos.filter((p) =>
      categoria ? p.category === categoria : true,
    ); //si existe categoria, devuelvo solo los que coinciden, si no, devuelvo todos
    return [...filtroCategoria].sort((a, b) => {
      if (precio === "menor") {
        return a.price - b.price;
      }
      if (precio === "mayor") {
        return b.price - a.price;
      }
      return 0;
    });
  }, [productos, categoria, precio]);

  return (
    <>
      <main className="mx-auto max-w-7xl px-16 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Catálogo de productos
          </h1>
          <p className="mt-2 text-gray-600">
            Explorá nuestra selección de productos disponibles.
          </p>
        </header>

        {/* SECTION DE FILTROS */}
        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex justify-between gap-4">
            {/* Selects */}
            <div className="flex-1 grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Categoría
                </label>

                <select
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  id="category"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  {/* Opciones acá */}
                  <option value="">Todas las categorías</option>
                  <option value="beauty">Belleza</option>
                  <option value="fragrances">Fragancias</option>
                  <option value="furniture">Muebles</option>
                  <option value="groceries">Almacén</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="sort"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Ordenar por precio
                </label>

                <select
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  id="sort"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                >
                  <option value="">Sin ordenar</option>
                  <option value="menor">Menor precio</option>
                  <option value="mayor">Mayor precio</option>
                </select>
              </div>
            </div>

            {/* Buscador */}
            <div className="flex-1">
              <label
                htmlFor="search"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Buscar producto
              </label>

              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-1.5 focus:border-blue-500 focus:outline-none"
                id="search"
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* SECTION DE GRILLA DE PRODUCTOS */}
        {estadoProductos.status === "loading" && <LoadingMessage />}

        {estadoProductos.status === "error" && (
          <ErrorMessage mensaje={estadoProductos.error} />
        )}

        {estadoProductos.status === "success" && (
          <section className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {productosFiltrados.map((producto) => (
              <ProductoCard producto={producto} key={producto.id} />
            ))}
          </section>
        )}
      </main>
    </>
  );
}

export default Catalogo;
