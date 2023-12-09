import LoadingLogo from "../../../shared/components/loading/LoadingLogo"
import { useGetUser } from "../../../shared/hooks/useGetUser"
import AddUrl from "../components/add-url/AddUrl"
import SignOut from "../components/sign-out/SignOut"

import URL from "../components/url/container/URL"

const Profile = () => {

  const {data,isPending,isError} =  useGetUser()
  
  if(isPending){
    return <LoadingLogo />
  }
  if(isError){
    return <h1>there is a connection error</h1>
  }


return (
        <main className="relative mt-5">
         <h1 className="text-3xl font-bold text-center font-Rancho">Welcome {data?.name}</h1>
         <SignOut />
         <AddUrl />
         <ul className="w-[80%] mx-auto mt-10">
         { 
          data?.urls ? data?.urls.length === 0 ? <h1 className="p-2 font-bold text-center text-red-500 rounded bg-secondary">you have no added domains yet</h1>: data.urls.map((url:string | null, i:number)=>(
            <URL url={url} key={i} />
            )) 
            : null
            }
          </ul>
        </main>
    )
}

export default Profile
