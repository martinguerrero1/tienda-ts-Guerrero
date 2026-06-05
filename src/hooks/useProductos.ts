import { useEffect, useState } from "react";
import type { EstadoAsync } from "../types/index";
import type { Producto } from "../types/producto";

function useProductos({ search }: { search?: string }) {
  //estado interno con tipado de EstadoAsync
  const [estado, setEstado] = useState<EstadoAsync<Producto[]>>({
    status: "idle",
  });

  useEffect(() => {
    const controller = new AbortController(); //controlador para abortar

    const fetchProductos = async () => {
      //funcion para fetch a los productos
      setEstado({ status: "loading" });

      const url = search
        ? `https://dummyjson.com/products/search?q=${search}`
        : "https://dummyjson.com/products";

      try {
        const response = await fetch(url, { signal: controller.signal }); //fetch conectado al controlador

        if (!response.ok)
          throw new Error("Hubo un error en la carga de los productos");

        const data = await response.json();

        setEstado({ status: "success", data: data.products });
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            return; //si se aborta, no se cambia el estado para que no se vuelva a montar el componente y el usuario pueda seguir buscando
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
      controller.abort(); //este comando sirve para desmontar el componente y la peticion del fetch con el, para que pueda actualizarse con el nuevo valor de search y hacer una nueva peticion.
    };
  }, [search]);

  return estado;
}

export default useProductos;
