import { useDeleteUrl } from "./useDeleteUrl";

import { FaSpinner } from "react-icons/fa6";
import { IoTrashBinSharp } from "react-icons/io5";

const DeleteUrl = ({url}:{url:string | null}) => {
  const deleteUrlMutation = useDeleteUrl();
  
  return (
    <button
      type="button"
      className={`flex items-center justify-center p-2 font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-500 bg-red-400 rounded text-center `}
      aria-label="delete url"
      disabled={deleteUrlMutation.isPending || deleteUrlMutation.isError}
      onClick={() =>{
        if(url){
            deleteUrlMutation.mutateAsync(url)
          }
      }
     }
    >
     {
         deleteUrlMutation.isPending ?   
         <FaSpinner className="w-5 h-5 animate-spin" />
       : <IoTrashBinSharp className="text-white " /> 
     }
      
    </button>
  );
};

export default DeleteUrl;
