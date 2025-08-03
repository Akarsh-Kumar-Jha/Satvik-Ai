import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Navbar from "../components/common/Navbar";

const COLORS = ["#4ade80", "#60a5fa", "#facc15"];

export default function Dashboard() {
  const User = useSelector((state) => state.auth.User);
  const [summary, setSummary] = useState(null);
  const [meals, setMeals] = useState([]);
  const [macroData, setMacroData] = useState([]);
  const [goalCalories, setGoalCalories] = useState(3000);
  const suggesationId = User?.AiSuggestion[0]?._id;
  const navigate = useNavigate();
  const location = useLocation();
  const showDashboard = location?.pathname?.split("/")[1] ==='dashboard' ? false : true;
    console.log("Path->",showDashboard);

  useEffect(() => {
    if (User?.AiSuggestion?.length) {
      const latestPlan = User.AiSuggestion[0];

      if (latestPlan?.AiResponse?.summary) {
        const planSummary = latestPlan.AiResponse.summary;
        setSummary(planSummary);

        const mealArray = latestPlan.AiResponse.meals || [];
        setMeals(mealArray);

        const macros = [
          { name: "Protein", value: parseFloat(planSummary.protein) },
          { name: "Carbs", value: parseFloat(planSummary.carbs) },
          { name: "Fat", value: parseFloat(planSummary.fat) },
        ];
        setMacroData(macros);

        setGoalCalories(3000);
      }
    }
  }, [User]);

  const totalKcal = parseInt(summary?.totalCalories || 0);
  const progress = Math.round((totalKcal / goalCalories) * 100);

  const handleMealClick = (item, index) => {
    navigate(`/meal/${suggesationId}?meal=${index}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-950 px-6 py-10 text-white font-inter">
      <Navbar showDashboard={showDashboard} />
      <h2 className="text-3xl font-bold text-lime-400 mb-1 mt-16">
        Welcome, {User?.name || "User"}!
      </h2>
      <p className="text-sm text-white/70 mb-6 max-w-2xl">
        Here's your <span className="text-white font-medium">latest AI-generated meal plan</span> focused on <span className="text-white font-medium">muscle gain</span>. Follow this for today or generate a new one any time.
      </p>

      <button
  onClick={() => navigate('/generate-meal')}
  className="bg-gradient-to-r mr-5 from-lime-400 to-emerald-500 text-black font-semibold px-6 py-3 rounded-xl mb-10 hover:scale-105 hover:shadow-xl transition-all"
>
  🚀 Generate a Fresh Meal Plan
</button>

<button
  onClick={() => navigate('/get-nutrition-insight')}
  className="bg-gradient-to-r from-teal-300 to-indigo-400 text-black font-semibold px-5 py-3 rounded-xl mb-10 hover:scale-105 hover:shadow-xl transition-all"
>
  📸 Get Food Details by Uploading Image
</button>

      {/* Summary Stats or fallback */}
      {summary ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Calories" value={summary.totalCalories} />
          <StatCard title="Protein" value={summary.protein} />
          <StatCard title="Carbs" value={summary.carbs} />
          <StatCard title="Fat" value={summary.fat} />
        </div>
      ) : (
        <div className="text-white/60 text-sm mb-6 italic">
          ⚠️ No summary data available. Generate a meal plan to get started!
        </div>
      )}

      {/* Progress Box */}
      {summary && (
        <div className="bg-gradient-to-r from-lime-900/30 via-emerald-800/20 to-cyan-800/20 border border-lime-400/40 p-5 rounded-2xl shadow-lg mb-10">
          <h3 className="text-xl font-semibold text-lime-300 mb-1">📌 Daily Intake Target</h3>
          <p className="text-4xl font-bold text-white">{summary.totalCalories}</p>
          <p className="text-sm mt-1 text-white/70">
            That’s <span className="text-emerald-400 font-semibold">{progress}%</span> of your daily goal!
          </p>
        </div>
      )}

      {/* Macro Pie Chart */}
      {macroData.length > 0 && (
        <div className="bg-zinc-800/50 border border-white/10 p-6 rounded-xl mb-10 max-w-md shadow-lg">
          <h4 className="text-lg font-semibold mb-3 text-white">🍽️ Macro Breakdown</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={macroData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {macroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", color: "white" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Meal List or fallback */}
      {meals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {meals.map((meal, index) => (
            <div
              onClick={() => handleMealClick(meal, index)}
              key={index}
              className="bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-white/10 p-4 rounded-2xl shadow hover:shadow-2xl hover:border-lime-400 transition cursor-pointer group"
            >
              <h4 className="text-lg font-semibold text-lime-400 group-hover:scale-105 transition">
                🍽️ {meal.time}
              </h4>
              <p className="text-white text-md mt-1">{meal.dish.name}</p>
              <p className="text-sm text-white/60 mt-1">
                {meal.dish.calories || "— kcal"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-white/60 mt-10 text-sm italic">
          ⚠️ No meals found. Try generating a new meal plan to get started.
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  const iconMap = {
    "Total Calories": "🔥",
    Protein: "💪",
    Carbs: "🍞",
    Fat: "🥑",
  };

  return (
    <div className="bg-gradient-to-tr from-zinc-800 via-zinc-900 to-black border border-white/10 rounded-xl p-4 shadow-md hover:shadow-lg transition">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{iconMap[title]}</span>
        <p className="text-sm text-white/70">{title}</p>
      </div>
      <h3 className="text-xl font-bold text-white">{value}</h3>
    </div>
  );
}