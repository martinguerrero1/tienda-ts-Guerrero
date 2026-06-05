import ProductoCard from "../components/ProductoCard";
import useProductos from "../hooks/useProductos";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";

function Catalogo() {
  const estadoProductos = useProductos({});

  switch (estadoProductos.status) {
    case "loading":
      return <LoadingMessage />;
    case "error":
      return <ErrorMessage mensaje={estadoProductos.error} />;
    case "success":
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

            <section className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {estadoProductos.data.map((producto) => (
                <ProductoCard producto={producto} key={producto.id} />
              ))}
            </section>
          </main>
        </>
      );
  }
}

export default Catalogo;
