import { useMutation } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query";

import useRestfulApi from "../../../../shared/hooks/useRestufulApi"


import { AddUrlForm } from "./AddUrl"

import { addUrlModel } from "../../../../models/UrlModel";

import { RefetchQueryFilters } from "@tanstack/react-query";
import TokenStorage from "../../../../shared/services/TokenStorage.service";


export const useAddUrl = () => {
  const {sendReq} = useRestfulApi();

  const queryClient = useQueryClient()

  const addUrlMutation = useMutation(
    {
      mutationKey:["login"],
      mutationFn:async(urlData:AddUrlForm)=>{
        const user = await TokenStorage.getId()
        return sendReq(`${user.userId}`, 'POST', JSON.stringify(urlData), addUrlModel)
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

