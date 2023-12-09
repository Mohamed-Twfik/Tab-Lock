import { CiLinkedin } from "react-icons/ci";
import { FaGithub } from "react-icons/fa";
import Gad from "../../../../assets/images/gad.jpeg"
import fero from "../../../../assets/images/fero.png"
import zika from "../../../../assets/images/zika.jpg"

const Team = () => {
  return (
    <section className="my-20 w-[90%] mx-auto">
        <h1 className="text-3xl xl:text-[3rem] font-bold text-center top-24 my-5 ">OUR TEAM</h1>
        <div className="flex flex-col items-center lg:justify-between lg:flex-row">
          <div className="flex flex-col items-center justify-center w-10/12 p-10 mb-4 rounded lg:mb-0 lg:w-3/12 bg-primary">
            <img src={Gad} alt="AI Engineer/ Mohamed Gad" className="w-32 h-32 mb-5 rounded-full" />
            <h2 className="mb-1 text-2xl font-extrabold">Mohamed Gad</h2>
            <p className="mb-3 text-xl font-bold font-Rancho">AI Engineer</p>
            <ul className="flex justify-between">
                <li className="w-4/12 text-3xl">
                    <a href="https://www.linkedin.com/in/mohamed-gad-0808a41b3/" target="_blank">
                     <CiLinkedin className="cursor-pointer hover:text-blue-600" />
                    </a>
                </li>
                <li className="w-4/12 text-3xl">
                    <a href="https://github.com/MuhamedGad" target="_blank">
                        <FaGithub className="cursor-pointer hover:text-violet-600" />
                    </a>
                </li>
            </ul>
          </div>
          <div className="flex flex-col items-center justify-center w-10/12 p-10 mb-4 rounded lg:w-3/12 lg:mb-0 bg-primary">
            <img src={fero} alt="BackEnd Engineer/ Mohamed Twfik" className="w-32 h-32 mb-5 rounded-full" />
            <h2 className="mb-1 text-2xl font-extrabold">Mohamed Twfik</h2>
            <p className="mb-3 text-xl font-bold font-Rancho">BackEnd Engineer</p>
            <ul className="flex justify-between">
                <li className="w-4/12 text-3xl">
                    <a href="https://www.linkedin.com/in/mohamed-twfik-bb6691216/" target="_blank">
                     <CiLinkedin className="cursor-pointer hover:text-blue-600" />
                    </a>
                </li>
                <li className="w-4/12 text-3xl">
                    <a href="https://github.com/Mohamed-Twfik" target="_blank">
                        <FaGithub className="cursor-pointer hover:text-violet-600" />
                    </a>
                </li>
            </ul>
          </div>
          <div className="flex flex-col items-center justify-center w-10/12 p-10 rounded lg:w-3/12 bg-primary">
            <img src={zika} alt="FrontEnd Engineer/ Zakaria Loai" className="w-32 h-32 mb-5 rounded-full" />
            <h2 className="mb-1 text-2xl font-extrabold">Zakaria Loai</h2>
            <p className="mb-3 text-xl font-bold font-Rancho">FrontEnd Engineer</p>
            <ul className="flex justify-between">
                <li className="w-4/12 text-3xl">
                    <a href="https://www.linkedin.com/in/zakaria-loai-b00616216/" target="_blank">
                     <CiLinkedin className="cursor-pointer hover:text-blue-600" />
                    </a>
                </li>
                <li className="w-4/12 text-3xl">
                    <a href="https://github.com/zikaloai71">
                        <FaGithub className="cursor-pointer hover:text-violet-600" target="_blank" />
                    </a>
                </li>
            </ul>
          </div>
        </div>

    </section>
  )
}

export default Team
