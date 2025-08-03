import React from "react";
import { Leaf, ImageIcon, Bot, Sparkles } from "lucide-react";
import Navbar from "../components/common/Navbar";

const features = [
  {
    title: "Personalized Veg Meal Plans",
    desc: "AI-generated meal plans tailored to your age, goals, lifestyle and food preferences — all 100% vegetarian.",
    icon: <Leaf className="w-6 h-6 text-lime-400" />,
  },
  {
    title: "Photo-Based Nutrition Analysis",
    desc: "Just upload your plate photo. Our AI instantly analyzes calories, macros, and nutrition score from the image.",
    icon: <ImageIcon className="w-6 h-6 text-cyan-400" />,
  },
  {
    title: "Ayurvedic & Satvik Guidance",
    desc: "Built on Indian principles — including seasonal suggestions, Satvik recipes, and ingredient benefits.",
    icon: <Sparkles className="w-6 h-6 text-yellow-300" />,
  },
  {
    title: "Smart Recipe Generator",
    desc: "Tell us what ingredients you have — we’ll craft tasty, healthy recipes using AI. No waste, all taste.",
    icon: <Bot className="w-6 h-6 text-emerald-400" />,
  },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-950 text-white px-6 md:px-20 py-16 font-inter">
        <Navbar showDashboard={true} />
      <div className="max-w-5xl mt-[10%] md:mt-[5%] mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-lime-400 mb-6">
          Why Choose SatvikAI?
        </h2>
        <p className="text-white/70 text-sm md:text-base mb-12">
          Experience the power of AI-driven vegetarian living — rooted in mindfulness, nutrition, and Indian wellness wisdom.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md hover:shadow-[0_0_25px_rgba(102,196,117,0.3)] transition-all"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="flex items-center gap-3 mb-4">
                {feature.icon}
                <h3 className="text-lg md:text-xl font-semibold text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}