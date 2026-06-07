import { useContext } from "react";
import { CarritoContext } from "./CarritoContext";

export const useCarrito = () => {
  const Contexto = useContext(CarritoContext);

  if (!Contexto)
    throw new Error("useCarrito debe utilizarse dentro de CarritoProvider");
  return Contexto;
};
