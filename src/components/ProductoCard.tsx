import type { Producto } from "../types/producto";
import { Link } from "react-router-dom";
import React from "react";

function ProductoCard({
  producto,
  onAgregar,
}: {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/producto/${producto.id}`} className="flex flex-1 flex-col">
        <div className="overflow-hidden">
          <img
            src={producto.thumbnail}
            alt={producto.title}
            className="h-56 w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between p-4">
          <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
            {producto.title}
          </h3>

          <p className="mt-4 text-2xl font-bold text-blue-600">
            ${producto.price}
          </p>
        </div>
      </Link>

      <div className="p-4 pt-0">
        <button
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          onClick={() => onAgregar(producto)}
        >
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}

export default React.memo(ProductoCard);
