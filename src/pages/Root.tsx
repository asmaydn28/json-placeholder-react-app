import { Outlet } from "react-router";
import NavbarBootstrap from "../components/Navbar";

const RootLayout = () => {
  return (
    <>
      <NavbarBootstrap />
      <Outlet />
    </>
  );
};

export default RootLayout;
