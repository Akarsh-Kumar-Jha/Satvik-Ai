import React from "react";
import AuthDiv from "../components/common/AuthDiv";

function Login() {
  const inputs = [
    {
      label: "Email",
      placeholder: "you@example.com",
      id: "email",
      name: "email"
    },
    {
      label: "Password",
      placeholder: "Create a password",
      id: "password",
      name: "password"
    },
  ];

  return (
    <div
      className="h-screen w-full flex justify-center items-center relative overflow-hidden"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dlnzbkyit/image/upload/v1753293373/ChatGPT_Image_Jul_23_2025_11_25_54_PM_rbjpre.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />
      <AuthDiv
        inputs={inputs}
        heading="Log in to your SatvikAI account"
        flexDirection={'row-reverse'}
        submitButton={"Log In"}
         optionButton={{
          text: "Don't have an account?",
          link: "/signup",
          linkText: "Signup",
        }}
        img={
          "https://res.cloudinary.com/dlnzbkyit/image/upload/v1753293373/ChatGPT_Image_Jul_23_2025_11_25_54_PM_rbjpre.png"
        }
      />
    </div>
  );
}

export default Login;
