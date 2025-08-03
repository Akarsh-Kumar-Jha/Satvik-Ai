import React, { useState } from "react";
import AuthDiv from "../components/common/AuthDiv";

function Signup() {
 const inputs = [
  {
    label: "Name",
    placeholder: "Enter your name",
    id: "name",
    name: "name",
  },
  {
    label: "Email",
    placeholder: "you@example.com",
    id: "email",
    name: "email",
    type: "email",
  },
  {
    label: "Password",
    placeholder: "Create a password",
    id: "password",
    name: "password",
    type: "password",
  },
];

  const [role,setRole] = useState('User');
  return (
    <div
      className="h-screen w-full flex justify-center items-center relative overflow-hidden"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dlnzbkyit/image/upload/v1753287015/ChatGPT_Image_Jul_23_2025_09_39_10_PM_ch0fp6.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 🔲 Overlay Blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />
      <AuthDiv
        inputs={inputs}
        role={role}
        setRole={setRole}
        heading=" Create your SatvikAI account"
        flexDirection={"row"}
        submitButton={"Create Account"}
           optionButton={{
          text: "Already have an account?",
          link: "/login",
          linkText: "Login",
        }}
        img={
          "https://res.cloudinary.com/dlnzbkyit/image/upload/v1753287015/ChatGPT_Image_Jul_23_2025_09_39_10_PM_ch0fp6.png"
        }
      />
    </div>
  );
}

export default Signup;
