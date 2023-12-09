import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { RefetchQueryFilters } from "@tanstack/react-query";

import useRestfulApi from "../../../../../../shared/hooks/useRestufulApi";
// import { useAuthStore } from "../../../../../../shared/store/authStore";

import { deleteUrlModel } from "../../../../../../models/UrlModel";

import TokenStorage from "../../../../../../shared/services/TokenStorage.service";

export const useDeleteUrl = () => {
  // const id = useAuthStore((state) => state.userId);
  const {sendReq} = useRestfulApi()
  const queryClient = useQueryClient();

  const deleteUrl = async (url:string)=>{
    const user = await TokenStorage.getId()
  
    const resp = await sendReq(`${user.userId}`,"PUT",JSON.stringify({url}),deleteUrlModel)
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


