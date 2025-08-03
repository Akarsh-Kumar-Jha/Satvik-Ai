import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from "../../redux/slices/AuthSlice";

function AuthDiv({
  heading,
  inputs,
  submitButton,
  optionButton,
  img,
  flexDirection,
  role,
  setRole,
}) {
  const containerFlexDirection =
    flexDirection === "row-reverse" ? "flex-row-reverse" : "flex-row";
  console.log("Flex Direction -> ", containerFlexDirection);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [apiCalled, setApiCalled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    console.log("Form Data:- ", { ...data, role });
    setApiCalled(true);
    try {
      const url =
        flexDirection === "row-reverse"
          ? "http://localhost:8000/api/v1/login"
          : "http://localhost:8000/api/v1/signup";
      const dataObj = {};
      if (data.email) dataObj.email = data.email;
      if (data.password) dataObj.password = data.password;
      if (data.name) dataObj.name = data.name;
      if (role) dataObj.accountType = role;
      console.log("Posting data:- ", dataObj);
      const response = await axios.post(url, dataObj, {
  withCredentials: true
});
      const logInorSigup =
        flexDirection === "row-reverse" ? "Logged In" : "Otp Sent";
      const userRole = response?.data?.User?.role;
      toast.success(` ${logInorSigup} `);
      const to =
        flexDirection === "row-reverse" ? "/dashboard" : "/verify-email";
      flexDirection !== "row-reverse"
        ? localStorage.setItem("email", dataObj.email)
        : "";
      if (flexDirection === "row-reverse") {
        dispatch(login(response?.data?.User));
      }
      to === "/dashboard"
        ? navigate(`/dashboard/${userRole.toLowerCase()}`)
        : navigate(to);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login Error!");
      console.error("Login Failed", error);
    } finally {
      setApiCalled(false);
    }
  };

  return (
    <div
      className={`relative z-10 flex ${containerFlexDirection} inter-font w-[90%] md:w-[80%] max-h-[90vh] md:h-auto shadow-xl rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-lg`}
    >
      {apiCalled && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <span className="relative flex h-14 w-14">
            <span className="animate-spin rounded-full border-[5px] border-white/10 border-r-blue-400 w-full h-full" />
          </span>
        </div>
      )}
      {/* Left Section */}
      <div className="w-full md:w-1/2 px-8 md:px-14 py-10 flex flex-col justify-start gap-y-6 bg-[#0f0f0fbb]">
        {/* Heading */}
        <h1 className="text-2xl md:text-4xl font-bold text-gradient bg-gradient-to-r from-lime-300 via-green-400 to-emerald-400 bg-clip-text text-transparent">
          {heading}
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-5 w-full text-white"
        >
          {role && setRole && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">
                Select Role
              </label>
              <div className="flex gap-4">
                {["User", "Nutritionist"].map((r) => (
                  <div
                    key={r}
                    onClick={() => setRole(r)}
                    className={`cursor-pointer px-5 py-2 rounded-full border transition duration-200 ${
                      role === r
                        ? "bg-gradient-to-r from-lime-400 via-green-500 to-emerald-400 text-black font-semibold"
                        : "border-white/30 text-white hover:bg-white/10"
                    }`}
                  >
                    {r}
                  </div>
                ))}
              </div>
            </div>
          )}

          {inputs.map((input, index) => (
            <div key={index} className="flex flex-col gap-2">
              <label
                htmlFor={input.id}
                className="text-sm font-medium text-gray-300"
              >
                {input.label}
              </label>
              <input
                type={input.type || "text"}
                id={input.id}
                placeholder={input.placeholder}
                {...register(input.name, {
                  required: `${input.label} is required`,
                })}
                className={`bg-white/5 border ${
                  errors[input.name] ? "border-red-500" : "border-gray-600"
                } text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${
                  errors[input.name]
                    ? "focus:ring-red-500"
                    : "focus:ring-lime-400"
                } placeholder:text-gray-400`}
              />
              {errors[input.name] && (
                <span className="text-red-500 text-xs">
                  {errors[input.name]?.message}
                </span>
              )}
            </div>
          ))}

          <div className="flex flex-col gap-4 mt-6 w-full">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-lime-400 via-green-500 to-emerald-400 text-black font-semibold rounded-xl hover:shadow-[0_0_15px_#66C475] transition"
            >
              {submitButton}
            </button>
          </div>
        </form>

        {/* Auth Link */}
        <p className="mt-6 text-sm text-gray-400">
          {optionButton.text}{" "}
          <a
            href={optionButton.link}
            className="text-lime-300 font-semibold hover:underline"
          >
            {optionButton.linkText}
          </a>
        </p>
      </div>

      {/* Right Image */}
      <div className="hidden md:block w-1/2 relative">
        <img src={img} alt="Visual" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    </div>
  );
}

export default AuthDiv;
