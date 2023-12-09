
import TokenStorage from "../../../../shared/services/TokenStorage.service"
import { useNavigate } from "react-router-dom"

const SignOut = () => {
  const navigate = useNavigate()
  const signOutHandler = () =>
   {
    TokenStorage.clearCookies()
    navigate("/")
  }
  
  return (
    <button className='absolute top-0 p-2 font-bold text-white bg-red-400 rounded right-1' onClick={signOutHandler}>
      Sign Out
    </button>
  )
}

export default SignOut
