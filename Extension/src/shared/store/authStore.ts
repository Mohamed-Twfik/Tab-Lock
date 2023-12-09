//outsource dependencies
import { create } from "zustand";

//services
import TokenStorage from "../services/TokenStorage.service";

//types
import { AuthState } from "../types/auth.types";

//create store to manage state of token
export const useAuthStore = create<AuthState>()((set) => ({
  token: TokenStorage.getToken() || null,
  userId:TokenStorage.getId() || null,
  setId:(userId) =>{
    set({userId})
    TokenStorage.storeId(userId)
  },
  setToken: (token) => {
    set({ token })
    TokenStorage.storeToken(token)
  },
  removeAuth: () => {
    set({ token: null });
    set({userId: null})
    TokenStorage.clearCookies();
  },
}));
