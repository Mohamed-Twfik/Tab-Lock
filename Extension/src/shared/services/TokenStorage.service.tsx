export default class TokenStorage {

  static async isAuthenticated() {
    return await this.getToken() !== null &&  await this.getToken() !== undefined;
  }

  static getAuthenticationHeader() {
    return this.getToken();
  }

  static storeId(id: string){
    chrome.storage.local.set({userId: id})
  }

  static getId(){
    return chrome.storage.local.get(["userId"])
  }

  static storeToken(token: string) {
    chrome.storage.local.set({tabLock: token})
  }

  static getToken() {
   
   return chrome.storage.local.get(["tabLock"])
  
  }

  static clearCookies() {
    chrome.storage.local.clear()
  }
}
