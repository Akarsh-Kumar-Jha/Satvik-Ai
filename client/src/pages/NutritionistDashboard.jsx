import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import StatCard from '../components/dashboard/StatCard';
import RecipeCard from '../components/dashboard/RecipeCard';
import RequestCard from '../components/dashboard/RequestCard';
import SectionHeading from '../components/dashboard/SectionHeading';

function NutritionistDashboard() {
  const user = useSelector((state) => state.auth.User);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

const totalPrepTime = user?.recipesCreated?.reduce((acc, item) => {
  return acc + Number(item.prepTime);
}, 0);

const avgPrepTime = user?.recipesCreated?.length
  ? totalPrepTime / user.recipesCreated.length
  : 0;

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white text-xl">
        <p className="text-red-400 font-semibold animate-pulse">User not logged in.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-x-hidden bg-gradient-to-br from-[#0f0f0f] via-[#111827] to-[#0f0f0f] text-white px-6 md:px-12 py-10 space-y-10 relative">
      <Navbar showDashboard={false} />
      <WelcomeBanner name={user.name} />

      {/* Glows */}
      <div className="absolute top-[-60px] right-[10px] w-[200px] h-[200px] rounded-full bg-green-500 opacity-20 blur-3xl pointer-events-none z-0" />
<div className="absolute top-[100px] left-[40%] w-[250px] h-[250px] rounded-full bg-blue-500 opacity-25 blur-[160px] pointer-events-none z-0" />
<div className="absolute bottom-[-60px] left-[10px] w-[250px] h-[250px] rounded-full bg-[#66C475] opacity-15 blur-2xl pointer-events-none z-0" />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Recipes Created" value={user?.recipesCreated?.length || 0} />
        <StatCard label="Meal Plan Requests" value={user?.mealPlanRequests?.length || 0} />
        <StatCard label="Clients Served" value={user?.clients?.length || 0} />
        <StatCard label="Avg. Prep Time" value={avgPrepTime} />
      </div>

      {/* Action */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate('/nutritionist/create-recipe')}
          className="px-5 py-2 bg-gradient-to-r from-emerald-400 via-green-400 to-lime-300 text-black font-semibold rounded-full shadow hover:scale-105 transition"
        >
          ➕ Create New Recipe
        </button>
      </div>

      {/* Recipes Section */}
      <SectionHeading title="Recent Recipes" subtitle="Your latest created recipes" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user?.recipesCreated?.length > 0 ? (
          user.recipesCreated.slice(0, 3).map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))
        ) : (
          <p className="text-gray-400 text-sm">No recipes created yet.</p>
        )}
      </div>
      <div className="text-right">
        <button
          onClick={() => navigate('/nutritionist/my-recipes')}
          className="text-emerald-300 underline hover:text-emerald-400 text-sm"
        >
          View All →
        </button>
      </div>

      {/* Meal Plan Requests */}
      <SectionHeading title="Meal Plan Requests" subtitle="Latest incoming requests" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user?.mealPlanRequests?.length > 0 ? (
          user.mealPlanRequests.slice(0, 3).map((req) => (
            <RequestCard key={req._id} request={req} />
          ))
        ) : (
          <p className="text-gray-400 text-sm">No requests yet.</p>
        )}
      </div>
      <div className="text-right">
        <button
          onClick={() => navigate('/nutritionist/meal-plans')}
          className="text-emerald-300 underline hover:text-emerald-400 text-sm mt-2"
        >
          View All →
        </button>
      </div>
    </div>
  );
}

export default NutritionistDashboard;
