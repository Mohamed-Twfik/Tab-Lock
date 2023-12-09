import firstStep from "../../../../assets/images/1st.jpg"
import secondStep from "../../../../assets/images/2nd.jpg"
import thirdStep from "../../../../assets/images/3rd.jpg"
import fourthStep from "../../../../assets/images/4th.jpg"

const HowItWorks = () => {
  return (
    <section className="relative">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#a2d9ff" fillOpacity="1" d="M0,256L80,245.3C160,235,320,213,480,176C640,139,800,85,960,90.7C1120,96,1280,160,1360,192L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>
      <div className="flex items-center justify-center mb-16 md:mb-0">
      <h1 className="absolute text-3xl xl:text-[3rem] font-bold text-center top-24 mt-3-10 ">HOW IT WORKS</h1>
      </div>
      
      <div className="flex flex-col items-center justify-center flex-wrap lg:flex-row lg:items-end  lg:justify-between mb-20 w-full lg:w-[90%]  mx-auto xl:items-center">
        
      <div className="relative flex flex-col items-center w-11/12 mb-5 xl:mb-0 lg:w-5/12 xl:w-3/12">
        <h1 className="absolute top-[-1rem] shadow-lg w-10 h-10 p-2 font-bold text-center text-white bg-blue-300 rounded-full ">1</h1>
        <div className="flex flex-col items-center w-full p-10 bg-blue-300 rounded">
        <img src={firstStep} alt="create account" className="w-64 mt-5 rounded h-44"/>
        <h2 className="my-3 font-extrabold text-center">Create Account</h2>
        <p className="font-medium text-center text-white">Fill your info and record video of your face for 30 secs</p>
        </div>
      </div>
      
      <div className="relative flex flex-col items-center w-11/12 mb-5 xl:mb-0 lg:w-5/12 xl:w-3/12">
        <h1 className="absolute top-[-1rem] shadow-lg w-10 h-10 p-2 font-bold text-center text-white bg-blue-300 rounded-full ">2</h1>
        <div className="flex flex-col items-center w-full p-10 bg-blue-300 rounded ">
        <img src={secondStep} alt="create account" className="w-64 mt-5 rounded h-44"/>
        <h2 className="my-3 font-extrabold text-center">Login and Add Domains</h2>
        <p className="font-medium text-center text-white">Login to your account and Add Any Domain You Want To lock it</p>
        </div>
      </div>
      
      <div className="relative flex flex-col items-center w-11/12 mb-5 lg:mb-0 lg:w-5/12 xl:w-3/12">
        <h1 className="absolute top-[-1rem] shadow-lg w-10 h-10 p-2 font-bold text-center text-white bg-blue-300 rounded-full ">3</h1>
        <div className="flex flex-col items-center w-full p-[3.4rem] bg-blue-300 rounded ">
        <img src={thirdStep} alt="create account" className="w-64 mt-5 rounded h-44"/>
        <h2 className="my-3 font-extrabold text-center">Download The Extension</h2>
        <p className="font-medium text-center text-white">Download Extension From Chrome Store</p>
        </div>
      </div>
    
      <div className="relative flex flex-col items-center w-11/12 lg:w-5/12 xl:w-4/12 xl:mx-auto xl:mt-5">
        <h1 className="absolute top-[-1rem] shadow-lg w-10 h-10 p-2 font-bold text-center text-white bg-blue-300 rounded-full ">4</h1>
        <div className="flex flex-col items-center p-10 bg-blue-300 rounded xl:p-8 ">
        <img src={fourthStep} alt="create account" className="w-64 mt-5 rounded h-44"/>
        <h2 className="my-3 font-extrabold text-center">Wait For 30 Minutes</h2>
        <p className="font-medium text-center text-white">Wait for 30 minutes for first time you create your account only and try to enter any domain you want to lock</p>
        </div>
      </div>
      </div>
        
        
    </section>
  )
}

export default HowItWorks
