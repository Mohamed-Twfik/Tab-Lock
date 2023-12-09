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


// import { useMutation } from "@tanstack/react-query"

// import { LoginData } from "../types/login.types"
// import { Login } from "../../../models/UserModel"

// import useRestfulApi from "../../../shared/hooks/useRestufulApi"


// export const useLogin = () => {
//   const {sendReq} = useRestfulApi()

//   const loginMutation = useMutation(
//     {
//       mutationKey:["login"],
//       mutationFn:async(userData:LoginData)=>{
//         const response = await fetch('http://127.0.0.1:5000/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(userData),
//     mode: 'cors',
//   });
//   console.log(response)
//   if (!response.ok) {
//     throw new Error('Login failed');
//   }
//   alert("Login Successfull")
//   return response.json();
//       }
//     }
//   )

//   return{
//   loginMutation
//   }

// }
