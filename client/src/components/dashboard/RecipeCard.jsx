import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white/5 p-4 rounded-xl shadow-lg hover:shadow-2xl transition space-y-2">
      <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover rounded-md" />
      <h3 className="text-lg font-semibold text-lime-400">{recipe.title}</h3>
      <p className="text-gray-400 text-sm line-clamp-2">{recipe.description}</p>
      <p className="text-xs text-gray-500">⏱ {recipe.prepTime + recipe.cookTime} mins</p>
      <button
        onClick={() => navigate(`/nutritionist/recipe/${recipe._id}`)}
        className="mt-2 px-3 py-1 bg-lime-400 text-black text-sm rounded hover:bg-lime-300 transition"
      >
        View Details
      </button>
    </div>
  );
};

export default RecipeCard;
