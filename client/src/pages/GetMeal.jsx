import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Loader } from "lucide-react";
import Navbar from "../components/common/Navbar";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../axios/axiosInstance";

function GetMeal() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
    preferredFood: [],
    mealsPerDay: "",
    goal: "",
  });

  const [allergenInput, setAllergenInput] = useState("");
  const [apiCalled,setApiCalled] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
  const { name, value } = e.target;

  const numberFields = ["age", "height", "weight", "mealsPerDay"];
  const isNumber = numberFields.includes(name);

  if (isNumber && !/^\d*$/.test(value)) {
    return;
  }

  setFormData((prev) => ({
    ...prev,
    [name]: isNumber ? Number(value) : value,
  }));
};

  const togglePreferredFood = (value) => {
    setFormData((prev) => ({
      ...prev,
      preferredFood: prev.preferredFood.includes(value)
        ? prev.preferredFood.filter((item) => item !== value)
        : [...prev.preferredFood, value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allergenList = allergenInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    const finalPayload = {
      ...formData,
      allergen: allergenList,
    };

    const {
      age,
      gender,
      height,
      weight,
      activityLevel,
      preferredFood,
      mealsPerDay,
      goal,
    } = finalPayload;

    if (
  !age ||
  !gender ||
  !height ||
  !weight ||
  !activityLevel ||
  preferredFood.length === 0 ||
  !mealsPerDay ||
  !goal
) {
  toast.error("Please fill in all required fields.");
  return;
}

if (age <= 0) {
  toast.error("Enter a valid age.");
  return;
}

if (height > 250) {
  toast.error("Height cannot be greater than 250 cm.");
  return;
}


if (height < 0) {
  toast.error("Enter a valid Height.");
  return;
}


if (weight > 500 || weight < 0) {
  toast.error("Weight not valid!");
  return;
}

if (mealsPerDay < 1 || mealsPerDay > 10) {
  toast.error("Meals per day should be between 1 and 10.");
  return;
}

 console.log("Final Data-> ",finalPayload);

    try {
        setApiCalled(true);
      const res = await axiosInstance.post('/generate-meal',
        finalPayload
      );
      toast.success("Meal Plan Generated Successfully!");
      console.log("Server Response:", res.data);
      navigate('/dashboard/user');
    } catch (err) {
      toast.error("Failed to generate meal plan.");
      console.error(err);
    }finally{
        setApiCalled(false)
    }
  };

  const foodOptions = [
    "Balanced Veg",
    "Diabetic Friendly",
    "Jain",
    "Gluten-Free",
    "Ayurvedic",
    "Low Carb Veg",
    "Pure Satvik",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#111827] to-[#0f0f0f] text-white px-4 md:px-10 py-12 font-inter">
        <Navbar showDashboard={true} />
  {
        (apiCalled) && (
<div className="fixed top-0 left-0 h-full w-[100%] bg-black/70 backdrop-blur-md flex flex-col items-center justify-center space-y-6 text-white text-center px-4 z-999">
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


      <div className="max-w-4xl mx-auto bg-white/5 p-8 md:p-12 rounded-3xl shadow-xl border border-white/10 mt-[10%]">
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-fuchsia-400 via-emerald-400 to-lime-300 bg-clip-text text-transparent mb-10 tracking-tight">
          🥗 Get Your Personalized Meal Plan
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Age" name="age" value={formData.age} onChange={handleChange} type="text" />
          <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["Male", "Female"]} />

          <Input label="Height (cm)" name="height" value={formData.height} onChange={handleChange} type="text" />
          <Input label="Weight (kg)" name="weight" value={formData.weight} onChange={handleChange} type="text" />

          <Select
            label="Activity Level"
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleChange}
            options={["Sedentary", "Light", "Moderate", "Active", "Very Active"]}
          />

          {/* Preferred Food Type */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm text-white/70 mb-2">Preferred Food Type</label>
            <div className="flex flex-wrap gap-2">
              {foodOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => togglePreferredFood(option)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    formData.preferredFood.includes(option)
                      ? "bg-gradient-to-r from-emerald-400 to-lime-400 text-black"
                      : "bg-zinc-800 border-white/10 text-white hover:bg-zinc-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Allergen input */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="allergen" className="block text-sm text-white/60 mb-1">
              Allergies (comma-separated)
            </label>
            <input
              type="text"
              name="allergen"
              id="allergen"
              value={allergenInput}
              onChange={(e) => setAllergenInput(e.target.value)}
              placeholder="e.g. Milk, Nuts, Soy"
              className="w-full px-4 py-3 bg-zinc-800 text-white border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          </div>

          <Input label="Meals per Day" name="mealsPerDay" value={formData.mealsPerDay} onChange={handleChange} type="text" />

          <Select
            label="Goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            options={["Lose Weight", "Gain Muscle", "Maintain", "Detox"]}
          />

          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-lime-400 to-emerald-500 text-black font-semibold py-3 rounded-xl hover:scale-[1.01] hover:shadow-xl transition-all"
            >
              Generate My Meal Plan 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Input Component
function Input({ label, name, value, onChange, type = "text" }) {
  const handleKeyDown = (e) => {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
    ];

    const isNumber = /^[0-9]$/.test(e.key);

    if (!isNumber && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="relative w-full">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder=" "
        className="peer w-full px-4 pt-6 pb-2 bg-zinc-800 text-white border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
      />
      <label
        htmlFor={name}
        className="absolute left-4 top-1.5 text-white/60 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-lime-300 bg-zinc-800 px-1"
      >
        {label}
      </label>
    </div>
  );
}


// Select Component
function Select({ label, name, value, onChange, options }) {
  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm text-white/60 mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-zinc-800 text-white border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 appearance-none"
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default GetMeal;
