import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/appwise.png";
import useCarrito from "../features/carrito/useCarrito";

export default function Header() {
  const Carrito = useCarrito();

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo y nombre */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo Tienda TS"
            className="h-12 w-12 rounded-full object-cover"
          />

          <Link to="/" className="text-2xl font-bold text-gray-800">
            Tienda TS
          </Link>
        </div>

        {/* Navbar */}
        <nav className="flex items-center gap-6">
          <Link
            to="/productos"
            className="font-medium text-gray-700 transition hover:text-blue-600"
          >
            Productos
          </Link>

          <button
            aria-label="Abrir carrito"
            className="rounded-lg p-2 text-xl text-gray-700 transition hover:bg-gray-100 hover:text-blue-600 relative"
          >
            <FaShoppingCart />
            <span className="absolute -bottom-1.5 -right-1.5">
              {" "}
              {Carrito.totalItems}{" "}
            </span>
          </button>

          <button
            className="
              rounded-lg
              bg-blue-600
              px-4
              py-2
              font-medium
              text-white
              transition
              hover:bg-blue-700
            "
          >
            Login
          </button>
        </nav>
      </div>
    </header>
  );
}
