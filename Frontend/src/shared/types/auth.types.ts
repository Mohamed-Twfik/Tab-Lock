export type AuthState ={
    token: string | null,
    userId: string | null,
    setId: (userId:string) => void,
    setToken: (token: string) => void,
    removeAuth: () => void,
}