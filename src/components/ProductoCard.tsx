import type { ProductoPreview } from "../types/producto";
import { Link } from "react-router-dom";

function ProductoCard({
  producto: { id, title, price, thumbnail },
}: {
  producto: ProductoPreview;
}) {
  return (
    <Link
      to={`/producto/${id}`}
      className="flex flex-col rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-lg"
    >
      <img
        src={thumbnail}
        alt={title}
        className="flex-1 h-56 w-full object-cover"
      />
      <div className="flex flex-col flex-1 justify-between p-4">
        {/* TITULO */}
        <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-gray-900">
          {title}
        </h3>
        <p className="mt-3 text-2xl font-bold text-blue-600">${price}</p>
      </div>
    </Link>
  );
}

export default ProductoCard;
