import { useMutation } from "@tanstack/react-query"

import { LoginData } from "../types/login.types"
import { Login } from "../../../models/UserModel"

import useRestfulApi from "../../../shared/hooks/useRestufulApi"


export const useLogin = () => {
  const {sendReq} = useRestfulApi()

  const loginMutation = useMutation(
    {
      mutationKey:["login"],
      mutationFn:(userData:LoginData)=>{
        return sendReq('login', 'POST', JSON.stringify(userData), Login)
      }
    }
  )

  return{
  loginMutation
  }

}


