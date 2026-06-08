import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import DrawerCarrito from "../components/DrawerCarrito";
import useToggle from "../hooks/useToggle";

function MainLayout() {
  const { valor, desactivar, toggle } = useToggle();
  return (
    <>
      <Header onToggle={toggle} />
      <Outlet />
      {valor && <DrawerCarrito onClose={desactivar} />}
    </>
  );
}

export default MainLayout;
