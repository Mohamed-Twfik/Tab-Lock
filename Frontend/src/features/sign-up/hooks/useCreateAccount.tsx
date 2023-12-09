import { useMutation } from "@tanstack/react-query"

import { CreateUser } from "../../../models/UserModel"

import useRestfulApi from "../../../shared/hooks/useRestufulApi"


export const useCreateAccount = () => {
    const {sendReq} = useRestfulApi()

    const signUpMutation = useMutation(
      {
        mutationKey:["signUp"],
        mutationFn:(userData:FormData)=>{
          return sendReq('register', 'POST', userData, CreateUser)
        }
      }
    )
  
    return{
    signUpMutation
    }
}



