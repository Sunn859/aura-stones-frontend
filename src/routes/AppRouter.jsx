import { createBrowserRouter } from "react-router";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import BirthMatch from "../pages/BirthMatch";
import Stones from "../pages/Stones";
import StoneDetail from "../pages/StoneDetail";
import RequireAuth from "./RequireAuth";
import Profile from "../pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
            path: "stones",
            element: <Stones />,
          },
          {
            path: "stones/:id",
            element: <StoneDetail />
          },
      {
        element: <RequireAuth />,
        children: [
          {
            path: "birthmatch",
            element: <BirthMatch />
          },
          {
            path: "profile",
            element: <Profile />
          },
          
        ]
      }
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;