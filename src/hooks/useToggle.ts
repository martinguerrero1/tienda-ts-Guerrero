import { useCallback, useState } from "react";

function useToggle(valorInicial: boolean = false) {
  const [valor, setValor] = useState(valorInicial);

  const activar = useCallback(() => {
    setValor(true);
  }, []);
  const desactivar = useCallback(() => {
    setValor(false);
  }, []);
  const toggle = useCallback(() => {
    setValor((prev) => !prev);
  }, []);

  return {
    valor,
    activar,
    desactivar,
    toggle,
  };
}

export default useToggle;
