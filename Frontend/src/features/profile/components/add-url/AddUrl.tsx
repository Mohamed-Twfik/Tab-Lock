import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { useAddUrl } from "./useAddUrl";

import { FaSpinner } from "react-icons/fa6";

export type AddUrlForm = {
  url:string
}

const AddUrl = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddUrlForm>();
  
  const addUrlMutation = useAddUrl()
  
  const [urlFormError, setUrlFormError] = useState<string>("");
  
  const submitHandler: SubmitHandler<AddUrlForm> = async (data: AddUrlForm) => {
    const resp = await addUrlMutation.mutateAsync(data);
    if (resp.message === "Success..!") {
      setValue("url", "");
      setUrlFormError("");
    } else {
      if (resp.message === "the URL is already added..!") {
        setUrlFormError("This domain have been added before");
      } else {
        setUrlFormError("Check your internet connection");
      }
    }
  };
  
  return (
   <form className="relative flex flex-col items-center justify-center mt-24"
   onSubmit={(event) => void handleSubmit(submitHandler)(event)}
   >
    {urlFormError && <h1 className="font-bold text-red-500">{urlFormError}</h1>}
    <div className="w-[80%] md:w-[50%]">
    {errors.url? (
            <p className="text-red-500">{errors.url.message}</p>
          ) : (
            <label htmlFor="url" className="mb-1 text-gray-600">
             Write Domain
            </label>
          )}
    <input id="url" type="text" className="w-full p-2 mx-auto border-2 border-green-300 rounded focus:outline-none" placeholder="e.g: facebook.com" 
    {...register("url",{
      required:{
        value:true,
        message:"Url is required"
      },
      pattern:{
        value: /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/,
        message:"enter valid domain"
      }
    })}  />
    </div>
    <button aria-label="add url" className="absolute text-2xl left-[76%] bottom-0 bg-green-400 p-[0.4rem] rounded text-white font-bold hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-500" disabled={addUrlMutation.isPending || addUrlMutation.isError}>
      {
        addUrlMutation.isPending ?  <FaSpinner className="text-2xl animate-spin" /> : "+"
      }
    </button>
   </form>
  )
}

export default AddUrl
