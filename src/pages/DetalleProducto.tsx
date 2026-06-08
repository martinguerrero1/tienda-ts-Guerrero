import { useParams, Link } from "react-router-dom";
import useProductos from "../hooks/useProductos";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import useCarrito from "../features/carrito/useCarrito";

function DetalleProducto() {
  const { id } = useParams();

  const Carrito = useCarrito();
  const estadoProductos = useProductos({});

  switch (estadoProductos.status) {
    case "loading":
      return <LoadingMessage />;
    case "error":
      return <ErrorMessage mensaje={estadoProductos.error} />;
    case "success": {
      const producto = estadoProductos.data.find(
        (producto) => producto.id === Number(id),
      );

      return (
        producto && (
          <main className="mx-auto max-w-4xl px-6 py-10 flex flex-col items-center gap-5">
            <div className="grid gap-8 md:grid-cols-2">
              {/* IMAGEN */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <img
                  src={producto.thumbnail}
                  alt={producto.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* INFO */}
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-sm text-gray-500">
                    Categoría: {producto.category}
                  </span>

                  <h1 className="mt-2 text-3xl font-bold text-gray-900">
                    {producto.title}
                  </h1>

                  <p className="mt-4 text-gray-600">{producto.description}</p>

                  <div className="mt-6 space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">Marca:</span>{" "}
                      {producto.brand}
                    </p>

                    <p>
                      <span className="font-semibold">Stock:</span>{" "}
                      {producto.stock}
                    </p>
                  </div>
                </div>

                {/* PRECIO */}
                <div className="mt-8">
                  <p className="text-3xl font-bold text-blue-600">
                    ${producto.price}
                  </p>

                  <button
                    className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                    onClick={() => Carrito.agregarItem(producto)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>

            <Link
              to="/productos"
              className="w-fit rounded-lg px-5 py-2 bg-blue-600 text-white transition-colors hover:bg-blue-700"
            >
              Volver al catálogo
            </Link>
          </main>
        )
      );
    }
  }
}

export default DetalleProducto;
