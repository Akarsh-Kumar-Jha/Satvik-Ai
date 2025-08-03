import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Upload, ImagePlus, Loader, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../axios/axiosInstance";

export default function ImageInsights() {
  const [analysisData, setAnalysisData] = useState(null);
  const [dishName, setDishName] = useState("");
  const [demerits, setDemerits] = useState("");
  const [healthBenefits, setHealthBenefits] = useState("");
  const [misuseCases, setMisuseCases] = useState("");
  const [nutrients, setNutrients] = useState({});
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setExplanation(null);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first.");

    const formData = new FormData();
    formData.append("uploadedImage", file);

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        '/get-data-from-image',
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const data = response.data.data;
      if (data.vegetarian === false) {
        toast.error(data?.message);
        return;
      }

      setDishName(data?.dish_name);
      setDemerits(data?.demerits);
      setHealthBenefits(data?.health_benefits);
      setMisuseCases(data?.misuse_cases);
      setNutrients(data?.nutrients || {});
      setAnalysisData(data);
      toast.success("Meal analyzed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3fdf5] via-[#e4f8eb] to-[#ddf3e3] dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 px-4 py-10 relative overflow-hidden">
               <div className="w-6 h-6 md:w-10 md:h-10 cursor-pointer absolute md:top-10 top-8 left-5 text-white">
          <ArrowLeft onClick={() => navigate(-1)} className="w-full h-full hover:text-lime-400" />
        </div>
      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center space-y-6 text-white text-center px-4">
          <Loader className="animate-spin w-12 h-12 text-lime-300" />
          <h2 className="text-xl font-semibold text-lime-300 animate-pulse">
            Analyzing your sattvic plate... 🌿
          </h2>
          <p className="text-sm text-white/70 max-w-sm">
            We're mindfully decoding your dish. Please wait while we extract
            its nutritional story.
          </p>
        </div>
      )}

      {/* Header */}
      <h1 className="text-[3vw] md:text-4xl font-bold text-center text-emerald-700 dark:text-lime-400 mb-10">
        🥦 SatvikAI — Image-Based Meal Analysis
      </h1>

      {/* Upload Box */}
      <div className="max-w-xl mx-auto bg-white dark:bg-zinc-900 border border-emerald-100/40 dark:border-white/10 rounded-2xl p-6 shadow-xl text-center">
        <label
          htmlFor="imgFile"
          className="cursor-pointer group flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 border-emerald-300 dark:border-lime-400 hover:bg-emerald-50 dark:hover:bg-zinc-800 transition"
        >
          <ImagePlus className="w-10 h-10 text-emerald-600 dark:text-lime-300 mb-2 group-hover:scale-110 transition" />
          <span className="text-emerald-700 dark:text-white/80">
            Click to Select Food Image
          </span>
        </label>
        <input
          type="file"
          id="imgFile"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        <button
          onClick={handleUpload}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-green-500 to-lime-400 text-white rounded-full font-medium shadow-md hover:scale-105 transition"
        >
          <Upload className="inline-block mr-2" size={18} /> Upload & Analyze
        </button>

        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="w-xs md:max-w-xs mx-auto rounded-lg border border-emerald-200 mt-6 shadow-md"
          />
        )}
      </div>

      {/* Analysis Section */}
      {dishName && (
        <div className="max-w-6xl mx-auto mt-12 space-y-10">
          <h2 className="text-3xl font-bold text-center text-emerald-700 dark:text-lime-400">
            🍽️ {dishName}
          </h2>

          {/* Nutrient Cards */}
          <div className="overflow-x-auto flex gap-5 snap-x snap-mandatory pb-4 px-2 no-scrollbar">
            {Object.entries(nutrients).map(([key, val]) => (
              <div
                key={key}
                className="snap-start min-w-[230px] bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-lime-400 rounded-xl p-5 shadow-md hover:shadow-lg transition"
              >
                <h4 className="text-lg font-semibold capitalize text-emerald-700 dark:text-lime-300 mb-2">
                  {key}
                </h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-200">{val}</p>
              </div>
            ))}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
            <InfoCard
              title="🌱 Health Benefits"
              content={healthBenefits}
              color="green"
            />
            <InfoCard
              title="⚠️ Demerits"
              content={demerits}
              color="red"
            />
            <InfoCard
              title="💡 Misuse Cases"
              content={misuseCases}
              color="yellow"
            />
          </div>
        </div>
      )}

      {/* Explanation Section */}
      {explanation && (
        <div className="max-w-6xl mx-auto mt-14 bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-lime-300 rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-emerald-700 dark:text-lime-400 mb-4">
            💬 Gemini's Explanation
          </h2>
          <p className="mb-6 text-sm text-zinc-800 dark:text-zinc-200">
            {explanation.explanation}
          </p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-green-600 mb-2">
              ✅ Why It’s Helpful
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
              {explanation.whyHelpful?.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-yellow-600 mb-2">
              🥘 Steps to Cook
            </h3>
            <ul className="list-decimal list-inside space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
              {explanation.stepsToCook?.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// 🔧 Reusable Info Card Component
function InfoCard({ title, content, color }) {
  const colorMap = {
    green: "text-green-600 dark:text-lime-300 border-lime-200 dark:border-green-400",
    red: "text-red-500 dark:text-rose-400 border-rose-200 dark:border-red-400",
    yellow: "text-yellow-500 dark:text-yellow-300 border-yellow-200 dark:border-yellow-400",
  };

  return (
    <div
      className={`bg-white dark:bg-zinc-900 rounded-xl p-5 border shadow ${colorMap[color]}`}
    >
      <h3 className={`text-lg font-semibold mb-2 ${colorMap[color].split(" ")[0]}`}>
        {title}
      </h3>
      <p className="text-sm text-zinc-700 dark:text-zinc-200">{content}</p>
    </div>
  );
}