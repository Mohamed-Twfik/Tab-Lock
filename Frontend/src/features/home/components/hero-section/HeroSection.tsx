import { TypeAnimation } from "react-type-animation"

import lightLogo from "../../../../assets/images/LightLogo.png"

const HeroSection = () => {
  return (
   <section className="h-[30rem] p-10 bg-blue-300 relative">
    <div className="mt-20 text-center">
    <TypeAnimation
      sequence={['Get Tired From Curious People ?', 1000, 'Want More Private Space !', 1000, 'Tab Lock Is The Solution 😄', 1000, 'Tab Lock is a browser extension 🧩', 1000, 'Tab Lock allows you to lock a domain with your own face 🔒', 1000]}
      style={{ fontSize: '3em', fontWeight: 700 , fontFamily: 'Rancho,sans-serif'  }}
      repeat={Infinity}
      />
    </div>
    <div className="flex items-center justify-center mt-20">
    <button className="px-4 py-4 font-bold text-white bg-green-500 rounded hover:bg-green-700">
      Download Now
    </button>
    </div>
    <div className="absolute bottom-0 right-0 opacity-25">
      
    <img src={lightLogo} className="w-32 h-32 md:h-64 md:w-64" alt="Tab Lock Logo" />
    </div>
   </section>
  )
}

export default HeroSection
