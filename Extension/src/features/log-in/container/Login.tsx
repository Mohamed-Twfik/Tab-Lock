import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginData } from "../types/login.types";
import { useNavigate } from "react-router-dom";

import LogoImage from "../../../assets/images/LightLogo.png";

import { useLogin } from "../hooks/useLogin";
import { useAuthStore } from "../../../shared/store/authStore";

const Login = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginData>();
  const [loginFormError, setLoginFormError] = useState<string>("");

  const navigate = useNavigate();
  const { loginMutation } = useLogin();

  const setToken = useAuthStore((state) => state.setToken);
  const setId = useAuthStore((state)=>state.setId)

  const submitHandler: SubmitHandler<LoginData> = async (data: LoginData) => {
    const resp = await loginMutation.mutateAsync(data);
    if (resp.message === "Success..!" && "token" in resp) {
      setValue("email", "");
      setValue("password", "");
      setToken(resp.token);
      setId(resp.user_id);
      navigate("/"); 
    } else {
      if (resp.message === "Invalid credentials") {
        setLoginFormError("Your email or password is incorrect");
      } else {
        setLoginFormError("Check your internet connection");
      }
    }
  };

  return (
    <section className="h-[100vh] bg-gray-200">
      <form
        className="flex flex-col items-center justify-center p-[2.5rem]"
        onSubmit={(event) => void handleSubmit(submitHandler)(event)}
      >
        <img
          src={LogoImage}
          className="w-32 h-32 md:h-64 md:w-64 "
          alt="Tab Lock"
        />

        {loginFormError ? (
          <p className="mb-10 text-2xl text-red-500">{loginFormError} </p>
        ) : (
          <h1 className="mb-10 text-3xl text-gray-600">
            login to your account
          </h1>
        )}

        <div className="w-[80%] md:w-[50%]">
          {errors.email ? (
            <p className="text-red-500">{errors.email.message}</p>
          ) : (
            <label htmlFor="email" className="w-full mb-1 text-gray-600">
              E-MAIL
            </label>
          )}
          <input
            className={`w-full p-3 mb-5 text-gray-800 bg-white border-2 border-gray-100 rounded shadow-xl  ${
              errors.email || loginFormError
                ? "focus:outline-red-500 shadow-red-100 border-red-200"
                : "focus:outline-gray-300"
            }`}
            type="text"
            id="email"
            {...register("email", {
              required: {
                value: true,
                message: "email is required",
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "invalid email address",
              },
            })}
          />
        </div>
        <div className="w-[80%] md:w-[50%]">
          {errors.password ? (
            <p className="text-red-500">{errors.password.message}</p>
          ) : (
            <label htmlFor="password" className="mb-1 text-gray-600">
              PASSWORD
            </label>
          )}
          <input
            className={`w-full p-3 mb-5 text-gray-800 bg-white border-2 border-gray-100 rounded shadow-xl  ${
              errors.password || loginFormError
                ? "focus:outline-red-500 shadow-red-100 border-red-200"
                : "focus:outline-gray-300"
            }`}
            type="password"
            id="password"
            {...register("password", {
              required: {
                value: true,
                message: "password is required",
              },
            })}
          />
        </div>
        <button
          className="w-24 px-4 py-2 mt-2 font-bold tracking-widest text-white bg-green-400 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={errors.email || errors.password || loginMutation.isError || loginMutation.isPending ? true : false}
          type="submit"
        >
          Login
        </button>
      </form>
    </section>
  );
};

export default Login;
