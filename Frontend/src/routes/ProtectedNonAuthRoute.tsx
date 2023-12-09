import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../shared/store/authStore";


export const ProtectedNonAuthRoute = () => {
    const  token  = useAuthStore((state)=>state.token);
    if (!token) {
        return <Outlet />;
    }
    return <Navigate to="/profile" />;
};