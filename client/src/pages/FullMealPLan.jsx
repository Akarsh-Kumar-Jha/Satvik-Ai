import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Loader } from "lucide-react";
import { axiosInstance } from '../axios/axiosInstance';

function FullMealPlan() {
  const { suggesationId } = useParams();
  const [searchParams] = useSearchParams();
  const MealNo = searchParams.get('meal');
  const navigate = useNavigate();

  const [meal, setMeal] = useState({});
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState('');
  const [stepsToCook, SetStepsToCook] = useState([]);
  const [whyHelpful, SetwhyHelpful] = useState([]);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const user = useSelector((state) => state.auth.User);

  const explainDish = async () => {
    try {
      setLoadingExplanation(true);
      const res = await axiosInstance.post(
        '/generate-detailed-meal',
        {
          mealData: meal?.dish,
          suggestionId: suggesationId,
          UserName: user.name,
        }
      );

      setExplanation(res?.data?.data?.explanation);
      SetStepsToCook(res?.data?.data?.stepsToCook);
      SetwhyHelpful(res?.data?.data?.whyHelpful);
    } catch (err) {
      console.error("Explanation error:", err);
      setExplanation("Something went wrong while explaining the meal.");
    } finally {
      setLoadingExplanation(false);
    }
  };

  const fetchMeal = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        '/get-meal-details',
        {
          suggestionId: suggesationId,
          mealNo: MealNo,
        }
      );
      setMeal(res?.data?.Meal || {});
    } catch (error) {
      console.error("Error fetching meal:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeal();
  }, [suggesationId, MealNo]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] text-white px-6 py-10 font-inter relative">

      {
        (loading || loadingExplanation) && (
<div className="absolute top-0 left-0 h-[100%] w-[100%] bg-black/70 backdrop-blur-md flex flex-col items-center justify-center space-y-6 text-white text-center px-4 z-999">
 <Loader className="animate-spin w-12 h-12 text-lime-300" />
  
  <h2 className="text-xl font-semibold text-lime-300 animate-pulse">
    Crafting your nutritious meal...
  </h2>

  <p className="text-sm text-white/70 max-w-sm">
    Hold on tight! We’re preparing a personalized, healthy meal just for you based on your unique profile 🍽️💚
  </p>
</div>
        )
      }

       <div className="w-10 h-10 cursor-pointer">
  <ArrowLeft onClick={() => navigate(-1)} className="w-full h-full hover:text-lime-400" />
</div>
      <div className="absolute top-[10%] left-1/2 -translate-y-1/2 -translate-x-[10%] z-10 flex items-center justify-center pointer-events-none">
  <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-br from-lime-400 via-emerald-400 to-cyan-500 opacity-20 blur-[120px]" />
</div>
      <div className="max-w-4xl mx-auto bg-[#181818] p-8 rounded-3xl shadow-2xl border border-white/10 transition-all relative z-99">
        <h2 className="text-4xl font-extrabold text-lime-400 mb-4">{meal?.dish?.name}</h2>
        <p className="text-gray-300 text-lg mb-6">{meal?.dish?.description}</p>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="px-4 py-2 bg-lime-600/10 rounded-xl text-sm border border-lime-400">
            🕒 Prep Time: {meal?.dish?.prepTime}
          </div>
          <div className="px-4 py-2 bg-emerald-600/10 rounded-xl text-sm border border-emerald-400">
            🔥 Calories: {meal?.dish?.calories}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-green-300">🌿 Tags</h3>
          <div className="flex flex-wrap gap-2">
            {meal?.dish?.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs bg-gradient-to-r from-lime-400 to-emerald-400 text-black rounded-full font-medium shadow"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2 text-yellow-300">🧂 Ingredients</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            {meal?.dish?.ingredients?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Button */}
      {!explanation && <div className="flex justify-center">
          <button
            onClick={explainDish}
            className="px-6 cursor-pointer py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition text-white font-semibold rounded-xl shadow-md"
          >
            📖 Explain in Detail
          </button>
        </div>}
      </div>

      {/* Explanation Section */}
      {loadingExplanation ? (
        <p className="mt-6 text-center text-gray-400">Generating explanation...</p>
      ) : explanation && (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-[#1e1e1e] border border-white/10 rounded-2xl space-y-6">
          <div>
            <h3 className="text-2xl text-cyan-400 font-bold mb-2">✨ Personalized Explanation</h3>
            <p className="text-gray-200 leading-relaxed whitespace-pre-line">{explanation}</p>
          </div>

          <div>
            <h3 className="text-2xl text-yellow-300 font-bold mb-2">💪 Why This Meal is Helpful for You</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              {whyHelpful.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xl text-emerald-400 font-bold mb-2">👨‍🍳 Steps to Cook</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              {stepsToCook.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export default FullMealPlan;