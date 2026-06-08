import useCarrito from "../features/carrito/useCarrito";
import { FaTrash } from "react-icons/fa";

function DrawerCarrito({ onClose }: { onClose: () => void }) {
  const Carrito = useCarrito();
  return (
    <>
      {/* Overlay oscuroo */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="fixed right-0 top-0 z-50 flex h-screen md:h-3/4 md:rounded-xl md:top-3 md:right-3 w-full max-w-sm flex-col bg-white shadow-2xl"
        aria-label="Carrito de compras"
      >
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Tu carrito</h2>
            <p className="text-sm text-gray-500">
              Revisá los productos agregados
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </header>

        <section className="flex-1 overflow-y-auto px-5 py-4">
          {/* VERIFICACION PARA LISTAR LOS PRODUCTOS EN EL DRAWER */}
          {Carrito.items.length > 0 ? (
            Carrito.items.map((item) => (
              <article
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-gray-900">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Cantidad: {item.cantidad}
                  </p>
                </div>

                <span className="font-semibold text-blue-600">
                  ${item.price}
                </span>

                <button
                  type="button"
                  className="cursor-pointer transition hover:bg-gray-100 p-1.5 rounded-l"
                  onClick={() => Carrito.quitarItem(item.id)}
                >
                  <FaTrash className="text-red-700" />
                </button>
              </article>
            ))
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-lg font-semibold text-gray-700">
                El carrito está vacío
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Agregá productos para verlos acá.
              </p>
            </div>
          )}
        </section>

        <footer className="border-t border-gray-200 px-5 py-4">
          <div className="mb-4 flex items-center justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-blue-600">${Carrito.totalPrecio}</span>
          </div>

          <button
            type="button"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 "
          >
            Finalizar compra
          </button>
        </footer>
      </aside>
    </>
  );
}

export default DrawerCarrito;
