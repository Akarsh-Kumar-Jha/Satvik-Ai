import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/common/Navbar';
import { Bookmark } from "lucide-react";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/AuthSlice';
import { axiosInstance } from '../axios/axiosInstance';

const FullRecipeCard = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const user = useSelector((state) => state.auth.User);
  let SavedValue = user?.savedRecipes?.some((item) => item._id===id?true:false);
  console.log("Value Of Saved ->",SavedValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsSaved(SavedValue);
    const fetchRecipe = async () => {
      try {
        const res = await axiosInstance.get(`/recipe/get/${id}`);
        setRecipe(res.data.recipe);
      } catch (err) {
        console.error("Failed to fetch recipe", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <span className="animate-spin w-10 h-10 border-4 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 text-lg font-semibold bg-black">
        🚫 Recipe not found.
      </div>
    );
  }

const saveRecipe = async (recipeId) => {
  try {
    const res = await axiosInstance.post(
      "/recipe/save-recipe",
      { recipeId },
    );
    setIsSaved(true);

const fetchUser = async() => {
  try {
    const response = await axiosInstance.get('/get-user');
    console.log("Response In App.jsx ->",response.data.data);
    dispatch(login(response.data.data));
  } catch (error) {
    console.log("Error Occuered In App.jsx -> ",error);
    dispatch(setLoading());
  }
}

    fetchUser();
    toast.success("Recipe saved successfully!");
  } catch (error) {
    console.error("Save error:", error);
    toast.error("Failed to save recipe.");
  }
};


  return (
    <div className="relative h-screen overflow-x-hidden w-full bg-gradient-to-br from-black via-zinc-900 to-zinc-950 text-white px-6 py-12 font-inter scrollbar-hide">
      <Navbar showDashboard={true} />
      {/* Glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[300px] h-[300px] rounded-full bg-green-500 opacity-20 blur-[120px] z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] rounded-full bg-blue-500 opacity-25 blur-[140px] z-0" />

      <div className="relative mt-[6%] z-10 max-w-5xl mx-auto space-y-10">
        {/* Title & Image */}
        <div className="text-center space-y-6">


        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-lime-300 via-emerald-400 to-green-400 bg-clip-text text-transparent">
  {recipe.title}
</h1>

{isSaved ? (
  <button
    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white font-semibold cursor-default"
  >
    <Bookmark size={18} /> Saved
  </button>
) : (
  <button
    onClick={() => saveRecipe(id)}
    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-lime-400 text-black font-semibold hover:scale-105 hover:shadow-lg transition-all"
  >
    <Bookmark size={18} /> Save Recipe
  </button>
)}

          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full max-w-[520px] max-h-[420px] object-cover rounded-2xl mx-auto shadow-xl border border-white/10"
          />
        </div>

        {/* Creator */}
        <div className="flex items-center gap-4">
          <img
            src={recipe.createdBy.Image}
            alt={recipe.createdBy.name}
            className="w-12 h-12 rounded-full border border-lime-400 shadow"
          />
          <div>
            <p className="text-sm text-gray-400">Created by</p>
            <p className="text-md text-emerald-300 font-semibold">{recipe.createdBy.name}</p>
          </div>
        </div>

        <hr className="border-white/10" />

        {/* Time & Tags */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <span>🕐 Prep: {recipe.prepTime} mins</span>
            <span>🍳 Cook: {recipe.cookTime} mins</span>
            <span>⏱ Total: {recipe.prepTime + recipe.cookTime} mins</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-green-400 to-lime-400 text-sm rounded-full text-black font-semibold shadow hover:scale-105 transition"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <Section title="📝 Description">
          <p className="text-gray-300 text-md leading-relaxed">{recipe.description}</p>
        </Section>

        {/* Ingredients */}
        <Section title="🧂 Ingredients">
          <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
            {recipe.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </Section>

        {/* Instructions */}
        <Section title="📋 Instructions">
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm">
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </Section>

        {/* Nutrition Facts */}
        <Section title="⚡ Nutrition Facts (per serving)">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-300">
            {Object.entries(recipe.nutritionFacts).map(([key, value], index) => (
              <div key={index} className="bg-white/10 p-4 rounded-lg text-center shadow-sm hover:scale-105 transition">
                <p className="capitalize font-semibold text-white">{key}</p>
                <p>
                  {value} {key === 'calories' ? 'kcal' : 'g'}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Additional Info */}
        <Section title="ℹ️ Additional Info">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Food Preference:</p>
              <p className="text-lime-300">{recipe.foodPreference.join(', ')}</p>
            </div>
            <div>
              <p className="text-gray-400">Allergens:</p>
              <p className="text-red-300">{recipe.allergens.join(', ') || "None"}</p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default FullRecipeCard;

const Section = ({ title, children }) => (
  <div className="bg-white/5 p-6 rounded-xl shadow-lg border border-white/10 space-y-4">
    <h2 className="text-xl font-bold text-green-300">{title}</h2>
    {children}
  </div>
);