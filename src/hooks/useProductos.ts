import { useEffect, useState } from "react";
import type { EstadoAsync } from "../types/index";
import type { Producto } from "../types/producto";

function useProductos({ search }: { search?: string }) {
  const [estado, setEstado] = useState<EstadoAsync<Producto[]>>({
    status: "idle",
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchProductos = async () => {
      setEstado({ status: "loading" });

      const url = search
        ? `https://dummyjson.com/products/search?q=${search}`
        : "https://dummyjson.com/products";

      try {
        const response = await fetch(url, { signal: controller.signal });

        const data = await response.json();

        if (!data)
          throw new Error("Hubo un error en la carga de los productos");

        setEstado({ status: "success", data: data.products });
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            return;
          }
          setEstado({ status: "error", error: error.message });
        } else {
          setEstado({
            status: "error",
            error: "Hubo un error en la carga de los productos",
          });
        }
      }
    };

    fetchProductos();

    return () => {
      controller.abort();
    };
  }, [search]);

  return estado;
}

export default useProductos;
