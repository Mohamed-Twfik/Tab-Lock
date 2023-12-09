import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoIosPerson } from "react-icons/io";
import { VscSignOut } from "react-icons/vsc";

import useClickOutSide from "../../hooks/useClickOutSide";
import { useAuthStore } from "../../store/authStore";

import lightLogo from "../../../assets/images/LightLogoCrop.png";

const NavBar = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const removeAuth = useAuthStore((state) => state.removeAuth);

  const [toggleProfileMenu, setToggleProfileMenu] = useState(false);

  const profileMenuRef = useRef<HTMLLIElement | null>(null);

  useClickOutSide(profileMenuRef, () => {
    setToggleProfileMenu(false);
  });

  const toggleProfileMenuHandler = () => {
    setToggleProfileMenu((prevState) => !prevState);
  };

  const logOutHandler = () => {
    removeAuth();
    navigate("/");
  };

  return (
    <nav className="p-5 bg-primary">
      <ul className="flex items-center justify-between">
        <li className="w-1/12">
          <NavLink to="/" className="text-white">
            <img src={lightLogo} className="w-10 h-10 " alt="Tab Lock Logo" />
          </NavLink>
        </li>
        {token ? (
          <li className="relative w-1/12" ref={profileMenuRef}>
            <p onClick={toggleProfileMenuHandler} className="cursor-pointer">
              <CgProfile className="text-3xl font-extrabold text-gray-700 " />
            </p>
            {toggleProfileMenu && (
              <ul className="absolute left-[-8rem]  rounded bg-blue-400 h-20 w-40  z-50">
                <li className="flex items-center w-full h-10 hover:bg-gray-100">
                  <NavLink
                    to="/profile"
                    className="flex items-center text-green-800"
                  >
                    <IoIosPerson className="mx-2 text-2xl" />
                    <span>Profile</span>
                  </NavLink>
                </li>
                <li
                  onClick={logOutHandler}
                  className="flex items-center w-full h-10 text-red-800 cursor-pointer hover:bg-gray-100"
                >
                  <VscSignOut className="mx-2 text-2xl" />
                  <span> Log Out</span>
                </li>
              </ul>
            )}
          </li>
        ) : (
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `${
                  isActive
                    ? "text-white border-2 border-white"
                    : "text-gray-500"
                } p-2 mx-2 font-bold  bg-green-300`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/signUp"
              className={({ isActive }) =>
                `${
                  isActive
                    ? "text-white border-2 border-white"
                    : "text-gray-500"
                } p-2 font-bold  bg-red-300`
              }
            >
              Sign Up
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
