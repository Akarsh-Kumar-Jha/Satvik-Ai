import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black via-zinc-900 to-zinc-950 text-white px-6 font-inter">
      <div className="bg-white/5 border border-white/10 p-10 rounded-3xl shadow-xl text-center max-w-md w-full">
        <Lock className="w-12 h-12 text-red-400 mx-auto mb-4" />

        <h1 className="text-3xl font-bold text-red-400 mb-2">Access Denied</h1>
        <p className="text-white/70 mb-6">
          You don't have permission to access this page. Please login with the appropriate role.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-lime-400 to-emerald-500 text-black font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all"
        >
          ⬅️ Go Back Home
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;