import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { RefetchQueryFilters } from "@tanstack/react-query";

import useRestfulApi from "../../../../../../shared/hooks/useRestufulApi";
import { useAuthStore } from "../../../../../../shared/store/authStore";

import { deleteUrlModel } from "../../../../../../models/UrlModel";

export const useDeleteUrl = () => {
  const id = useAuthStore((state) => state.userId);
  const {sendReq} = useRestfulApi()
  const queryClient = useQueryClient();

  const deleteUrl = (url:string)=>{
    const resp = sendReq(`${id}`,"PUT",JSON.stringify({url}),deleteUrlModel)
    return resp
  }

  const deleteUrlMutation = useMutation({
    mutationKey:["deleteUrl"],
    mutationFn:(url:string)=>deleteUrl(url),
    onSuccess:async()=>{
       queryClient.refetchQueries(["getUser"] as  RefetchQueryFilters)
    }
  })

  return(
    deleteUrlMutation
  )
  
}


