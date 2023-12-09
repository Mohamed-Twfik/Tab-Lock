import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { ProtectedNonAuthRoute } from "./ProtectedNonAuthRoute";

import NavBar from "../shared/components/nav-bar/NavBar";
import Footer from "../shared/components/footer/Footer";

import Login from "../features/log-in/container/Login";
import SignUp from "../features/sign-up/container/SignUp";
import HomePage from "../features/home/container/HomePage";
import Profile from "../features/profile/container/Profile";
import NotFound from "../features/not-found/NotFound";



const Routes = () => {

  const routesForPublic = [
  {
    path: "/",
    element: 
    <>
      <NavBar />
      <HomePage />
      <Footer />
    </>,
  },
  ];

  const routesForUsersOnly = [
    {
      path: "/",
      element: 
      <>
        <NavBar />
        <ProtectedRoute />
        <Footer />
      </>,
      children: [
        {
          path: "/profile",
          element: <Profile />,
        }
  
      ],
    },
  ];

  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: 
      <>
      <NavBar />
      <ProtectedNonAuthRoute />
      <Footer />
      </>,
      children: [
        {
          path: "/logIn",
          element: <Login />,
        },
        {
          path: "/signUp",
          element: <SignUp />,
        }
      ],
    }

  ];

  const errorRoute = {
    path: "*",
    element: <NotFound />,
  };

  const router = createBrowserRouter([
    ...routesForPublic,
    ...routesForUsersOnly,
    ...routesForNotAuthenticatedOnly,
    errorRoute,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
