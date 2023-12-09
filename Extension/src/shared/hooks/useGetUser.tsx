import { useQuery } from "@tanstack/react-query";

import useRestfulApi from "./useRestufulApi";

import { useAuthStore } from "../store/authStore";

import { getUserModel } from "../../models/UserModel";

export const useGetUser = () => {
  const userId = useAuthStore((state) => state.userId);
  const { sendReq } = useRestfulApi();

  const getUser = async () => {
    const id = await userId;

    const resp = await sendReq(`${id}`, "GET", null, getUserModel);

    if ("user" in resp) {
      chrome.storage.local.set({ urls: resp.user.urls });
  
      return resp?.user;
    }
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ["getUser"],
    queryFn: getUser,
  });

  return {
    data,
    isPending,
    isError,
  };
};
