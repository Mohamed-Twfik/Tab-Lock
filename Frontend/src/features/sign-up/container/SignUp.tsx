import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

import VideoRecord from "../components/video-record/VideoRecord";

import { useVideoStore } from "../store/videoStore";
import { useCreateAccount } from "../hooks/useCreateAccount";

import { SignupData } from "../types/signup.types";
import LogoImage from "../../../assets/images/LightLogo.png";

const SignUp = () => {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<SignupData>();
  
  const { signUpMutation } = useCreateAccount();
  const [signUpFormError, setSignUpFormError] = useState<string>("");
  
  const video = useVideoStore((state) => state.video);
  const deleteVideo = useVideoStore((state) => state.removeVideo);
  
  const submitHandler: SubmitHandler<SignupData> = async (data: SignupData) => {
    if (!video) {
      setSignUpFormError("Please record a video");
      return;
    }
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("video", video, `${data.name}.webm`)
    const resp = await signUpMutation.mutateAsync(formData);
    
    if (resp.message === "Success..!" && "user_id" in resp) {
      setValue("name", "");
      setValue("email", "");
      setValue("password", "");
      setValue("confirmPassword", "");
      deleteVideo();
      navigate("/login"); 
    } else {
        setSignUpFormError(resp.message);
    }
  };
  
  return (
    <section className="bg-gray-200 ">
      <form className="flex flex-col items-center p-20"  onSubmit={(event) => void handleSubmit(submitHandler)(event)}>
      <img
          src={LogoImage}
          className="w-32 h-32 md:h-64 md:w-64 "
          alt="Tab Lock"
        />
          {signUpFormError? (
          <p className="mb-10 text-2xl text-red-500">{signUpFormError} </p>
        ) : (
          <h1 className="mb-10 text-3xl text-gray-600">
            create new account
          </h1>
        )}
      
        <div className="w-[80%] md:w-[50%]">
          {errors.name ? (
            <p className="text-red-500">{errors.name.message}</p>
          ) : (
            <label htmlFor="name" className="w-full mb-1 text-gray-600">
            Full Name
            </label>
          )}
          <input
            id="name"
            className={`w-full p-3 mb-5 text-gray-800 bg-white border-2 border-gray-100 rounded shadow-xl  ${
              errors.name || signUpFormError
                ? "focus:outline-red-500 shadow-red-100 border-red-200"
                : "focus:outline-gray-300"
            }`}
            type="text"
            {...register("name", {
              required: {
                value: true,
                message: "name is required",
              },
              minLength:{
                value:3,
                message:"name must be at least 3 characters"
              },
              maxLength:{
                value:20,
                message:"name must be at most 20 characters"
              }
            })}
          />
        </div>
        <div className="w-[80%] md:w-[50%]">
          {errors.email ? (
            <p className="text-red-500">{errors.email.message}</p>
          ) : (
            <label htmlFor="name" className="w-full mb-1 text-gray-600">
            E-MAIL
            </label>
          )}
          <input
            id="email"
            type="text"
            className={`w-full p-3 mb-5 text-gray-800 bg-white border-2 border-gray-100 rounded shadow-xl  ${
              errors.email || signUpFormError
                ? "focus:outline-red-500 shadow-red-100 border-red-200"
                : "focus:outline-gray-300"
            }`}
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
            <label htmlFor="name" className="w-full mb-1 text-gray-600">
            PASSWORD
            </label>
          )}
          <input
            id="password"
            type="password"
            className={`w-full p-3 mb-5 text-gray-800 bg-white border-2 border-gray-100 rounded shadow-xl  ${
              errors.password || signUpFormError
                ? "focus:outline-red-500 shadow-red-100 border-red-200"
                : "focus:outline-gray-300"
            }`}
            {...register("password", {
              required: {
                value: true,
                message: "password is required",
              },
             pattern:{
                value:/^(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z]).{8,}$/,
                message:"password must be at least 8 characters and must contain at least one uppercase letter, one lowercase letter and one number"
              }
            })}
          />
        </div>

        <div className="w-[80%] md:w-[50%]">
        {errors.confirmPassword ? (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          ) : (
            <label htmlFor="name" className="w-full mb-1 text-gray-600">
              CONFIRM PASSWORD
            </label>
          )}
          <input
            id="confirmPassword"
            type="password"
            className={`w-full p-3 mb-5 text-gray-800 bg-white border-2 border-gray-100 rounded shadow-xl  ${
              errors.confirmPassword || signUpFormError
                ? "focus:outline-red-500 shadow-red-100 border-red-200"
                : "focus:outline-gray-300"
            }`}
            {...register("confirmPassword", {
              required: {
                value: true,
                message: "confirm password is required",
              },
              validate: (value) =>
                value === getValues("password") ||
                "The passwords do not match",
            })
            }
          />
        </div>
        <div className="w-[80%] md:w-[50%] flex flex-col ">
          <label  className="flex mb-1 text-gray-600">
              Record Video <div className="relative mx-1 underline cursor-pointer group">
                <span>why?</span>
                <p className="hidden absolute group-hover:block p-2 bg-green-400 font-bold text-white rounded top-5 left-1/4 w-[12.5rem]">This 30 secs video will help our model to indicate your face so try to center your face to camera and give us The form in which you appear most often😄</p>
              </div>
          </label>
          <VideoRecord />
        </div>
        <button
          className="px-4 py-2 mt-2 font-bold tracking-widest text-white bg-green-400 w-26 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={errors.name ||errors.email || errors.password || errors.confirmPassword || !video || signUpMutation.isError || signUpMutation.isPending ? true : false}
          type="submit"
        >
          create account
        </button>
      </form>
    </section>
  );
};

export default SignUp;
