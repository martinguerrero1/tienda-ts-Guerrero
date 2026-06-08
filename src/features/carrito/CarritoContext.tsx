import { createContext, useCallback, useMemo, type ReactNode } from "react";
import type { Producto, ProductoEnCarrito } from "../../types/producto";
import useLocalStorage from "../../hooks/useLocalStorage";

type CarritoContextValue = {
  items: ProductoEnCarrito[];
  agregarItem: (producto: Producto) => void;
  quitarItem: (productoId: number) => void;
  cambiarCantidad: (productoId: number, cantidad: number) => void;
  vaciarCarrito: () => void;
  totalItems: number; // calculado, no guardado
  totalPrecio: number; // calculado, no guardado
};

//CREACION DEL CONTEXTO
export const CarritoContext = createContext<CarritoContextValue | undefined>(
  undefined,
);

//CREACION DEL PROVIDER
export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<ProductoEnCarrito[]>(
    "carrito:v1",
    [],
  );

  const agregarItem = useCallback(
    (producto: Producto): void => {
      setItems((prev) => {
        const existeProducto = prev.some((p) => p.id === producto.id);
        if (!existeProducto) {
          return [...prev, { ...producto, cantidad: 1 }];
        } else {
          return prev.map((p) =>
            p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p,
          ); //mapeo para recrear el estado modificando solo la cantidad del prod seleccionado
        }
      });
    },
    [setItems],
  );

  const quitarItem = useCallback(
    (productoId: number): void => {
      setItems((prev) => {
        return prev
          .map((item) => {
            if (item.id === productoId) {
              return { ...item, cantidad: item.cantidad - 1 };
            }
            return item;
          })
          .filter((item) => item.cantidad > 0);
      });
    },
    [setItems],
  );

  const cambiarCantidad = useCallback(
    (productoId: number, cantidad: number): void => {
      setItems((prev) =>
        prev
          .map((item) =>
            item.id === productoId ? { ...item, cantidad: cantidad } : item,
          )
          .filter((item) => item.cantidad > 0),
      );
    },
    [setItems],
  );

  const vaciarCarrito = useCallback((): void => {
    setItems([]);
  }, [setItems]);

  const totalItems = useMemo(() => {
    return items.reduce((acc, item) => {
      acc = acc + item.cantidad;
      return acc;
    }, 0);
  }, [items]);

  const totalPrecio = useMemo(() => {
    return items.reduce((acc, item) => {
      acc = acc + item.price * item.cantidad;
      return Number(acc.toFixed(2));
    }, 0);
  }, [items]);

  const values = useMemo(() => {
    return {
      items,
      agregarItem,
      quitarItem,
      cambiarCantidad,
      vaciarCarrito,
      totalItems,
      totalPrecio,
    };
  }, [
    items,
    agregarItem,
    quitarItem,
    cambiarCantidad,
    vaciarCarrito,
    totalItems,
    totalPrecio,
  ]);

  return (
    <CarritoContext.Provider value={values}>{children}</CarritoContext.Provider>
  );
}
