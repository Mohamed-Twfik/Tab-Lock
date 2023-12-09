export type AuthState ={
    token: Promise<{ [key: string]: string | null }> | string | null,
    userId: Promise<{ [key: string]: string | null }> | string | null,
    setId: (userId:string) => void,
    setToken: (token: string) => void,
    removeAuth: () => void,
}