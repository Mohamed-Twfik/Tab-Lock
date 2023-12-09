import { useMutation } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query";

import useRestfulApi from "../../../../shared/hooks/useRestufulApi"
import { useAuthStore } from "../../../../shared/store/authStore";

import { AddUrlForm } from "./AddUrl"

import { addUrlModel } from "../../../../models/UrlModel";

import { RefetchQueryFilters } from "@tanstack/react-query";


export const useAddUrl = () => {
  const {sendReq} = useRestfulApi();
  const id = useAuthStore((state)=> state.userId)
  const queryClient = useQueryClient()

  const addUrlMutation = useMutation(
    {
      mutationKey:["login"],
      mutationFn:(urlData:AddUrlForm)=>{
        return sendReq(`${id}`, 'POST', JSON.stringify(urlData), addUrlModel)
      },
      onSuccess:async ()=>{
        await queryClient.refetchQueries(["getUser"] as RefetchQueryFilters);
      }
    }
  )
  
  return (
    addUrlMutation
  )
}

