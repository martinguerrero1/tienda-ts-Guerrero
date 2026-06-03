import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Catalogo from "./pages/Catalogo.tsx";
import NotFound from "./pages/NotFound.tsx";
import DetalleProducto from "./pages/DetalleProducto.tsx";
import MainLayout from "./layouts/MainLayout.tsx";

const ruta = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/productos",
        element: <Catalogo />,
      },
      {
        path: "/producto/:id",
        element: <DetalleProducto />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={ruta} />
  </StrictMode>,
);
