import { getCookie, removeCookie, setCookie } from "typescript-cookie";

export default class TokenStorage {

  static isAuthenticated() {
    return this.getToken() !== null && this.getToken() !== undefined;
  }

  static getAuthenticationHeader() {
    return `${this.getToken()}`;
  }

  static storeId(id: string){
    setCookie("userId", id , { path: "/" })
  }

  static getId(){
    return getCookie("userId")
  }

  static storeToken(token: string) {
    setCookie("tabLock", token, { path: "/" });
  }

  static getToken() {
    return getCookie("tabLock");
  }

  static clearCookies() {
    removeCookie("tabLock", { path: "/" });
    removeCookie("userId", {path:"/"})
  }
}
