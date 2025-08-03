import React from "react";
import Navbar from "../components/common/Navbar";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-950 text-white px-6 md:px-20 py-16 font-inter">
        <Navbar showDashboard={true} />
      <div className="max-w-4xl mt-[20%] md:mt-[5%] mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-lime-400 text-center mb-4">
          Get in Touch
        </h2>
        <p className="text-white/70 text-sm md:text-base text-center mb-10">
          Whether you're a nutritionist, a curious user, or just want to say hello — we’d love to hear from you!
        </p>

        <form className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 backdrop-blur-md shadow-lg space-y-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-white/70">Your Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-white/70">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-white/70">Message</label>
            <textarea
              rows="5"
              placeholder="Write your message here..."
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-lime-400 to-emerald-500 text-black font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all"
          >
            ✉️ Send Message
          </button>
        </form>
      </div>
    </div>
  );
}