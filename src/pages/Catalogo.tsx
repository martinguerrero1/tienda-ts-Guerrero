import ProductoCard from "../components/ProductoCard";
import { products } from "../data/producto";

function Catalogo() {
  return (
    <>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Catálogo de productos
          </h1>
          <p className="mt-2 text-gray-600">
            Explorá nuestra selección de productos disponibles.
          </p>
        </header>

        <section className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((producto) => (
            <ProductoCard producto={producto} key={producto.id} />
          ))}
        </section>
      </main>
    </>
  );
}

export default Catalogo;
