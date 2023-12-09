import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../shared/store/authStore";


export const ProtectedRoute = () => {
    const  token  = useAuthStore((state)=>state.token);
    if (!token) {
        return <Navigate to="/logIn" />;
    }
    return <Outlet />;
};