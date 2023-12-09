import { useEffect,useState } from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";



import Login from "../features/log-in/container/Login";
import Profile from "../features/profile/container/Profile";

import TokenStorage from "../shared/services/TokenStorage.service";


const Routes = () => {

  const [tokenState, setTokenState] = useState< null | { [key: string]: string | null; }>(null);

  useEffect(() => {
    async function getToken() {
      const authorization = await TokenStorage.isAuthenticated()
      ? await TokenStorage.getAuthenticationHeader()
      : null;
      setTokenState(authorization);
    }
    getToken();
  },[tokenState])

  const routesForUsersOnly = [
    {
      path: "/",
      element: <Profile />,
    },
  ];

  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <Login />,
    },
  ];

  const router = createHashRouter([
    ...(tokenState?.tabLock ? routesForUsersOnly : routesForNotAuthenticatedOnly),
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
