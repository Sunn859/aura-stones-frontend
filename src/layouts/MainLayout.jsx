import { Outlet } from "react-router";
import Navbar from "../components/์Navbar";


function MainLayout() {
  return (
    <>
      <Navbar />

      <Outlet />
    </>
  );
}

export default MainLayout;