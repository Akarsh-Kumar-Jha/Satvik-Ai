import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { axiosInstance } from '../axios/axiosInstance';

const foodOptions = [
  "Pure Satvik", "Jain", "Gluten-Free", "Ayurvedic",
  "Low Carb Veg", "Diabetic Friendly", "Balanced Veg",
];

const allergenOptions = [
  "Gluten", "Dairy", "Nuts", "Soy", "Mustard", "Sesame", "Peanuts", "None",
];

const CreateRecipe = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    prepTime: '',
    cookTime: '',
    tags: [''],
    nutritionFacts: {
      calories: '',
      protein: '',
      fat: '',
      carbs: '',
      fiber: '',
      sugar: '',
    },
    foodPreference: [],
    allergens: [],
    recipeImage: null,
  });

  const [apiCalled,setApiCalled] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNutritionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      nutritionFacts: { ...prev.nutritionFacts, [name]: value },
    }));
  };

  const handleArrayChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const addField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const toggleSelection = (field, value) => {
    setFormData((prev) => {
      const updated = prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value];
      return { ...prev, [field]: updated };
    });
  };

  const validate = () => {
    if (formData.title.trim().length < 3) return 'Title must be at least 3 characters.';
    if (formData.description.trim().length < 10) return 'Description must be at least 10 characters.';
    if (formData.ingredients.some((i) => i.trim() === '')) return 'All ingredients must be filled.';
    if (formData.instructions.some((i) => i.trim() === '')) return 'All instructions must be filled.';
    if (formData.prepTime < 0) return 'Preparation time must be >= 0.';
    if (formData.cookTime < 2) return 'Cooking time must be >= 2.';
    if (!formData.recipeImage) return 'Recipe image is required.';
    const requiredKeys = ['calories', 'protein', 'fat', 'carbs'];
    for (let key of requiredKeys) {
      if (!formData.nutritionFacts[key]) return `Nutrition fact '${key}' is required.`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return toast.error(error);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'nutritionFacts') data.append(key, JSON.stringify(value));
      else if (Array.isArray(value)) data.append(key, JSON.stringify(value));
      else if (key === 'recipeImage') data.append('recipeImage', value);
      else data.append(key, value);
    });

    try {
        setApiCalled(true);
      const res = await axiosInstance.post(
        '/recipe/add-recipe',
        data
      );
      console.log("Response In Creation:- ",res);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create recipe');
    }finally{
        setApiCalled(false);
    }
  };

  const inputClass = "w-full p-3 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-white placeholder-gray-400 transition duration-150";

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-[#0f0f0f] via-[#111827] to-[#0f0f0f] text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-lime-300 text-center">Create a New Recipe</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title and Description */}
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Recipe Title" className={inputClass} />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe your recipe..." rows={4} className={`${inputClass} resize-none`} />

          {/* Ingredients, Instructions, Tags */}
          {["ingredients", "instructions", "tags"].map((field) => (
            <div key={field}>
              <label className="block capitalize text-sm mb-1">{field}</label>
              {formData[field].map((val, idx) => (
                <input
                  key={idx}
                  value={val}
                  onChange={(e) => handleArrayChange(field, idx, e.target.value)}
                  placeholder={`Enter ${field.slice(0, -1)} ${idx + 1}`}
                  className={`${inputClass} mb-2`}
                />
              ))}
              <button type="button" onClick={() => addField(field)} className="text-emerald-300 text-sm mt-1">
                + Add {field.slice(0, -1)}
              </button>
            </div>
          ))}

          {/* Time Inputs */}
          <div className="flex gap-4">
            <input name="prepTime" type="number" value={formData.prepTime} onChange={handleChange} placeholder="Prep Time (min)" className={inputClass} />
            <input name="cookTime" type="number" value={formData.cookTime} onChange={handleChange} placeholder="Cook Time (min)" className={inputClass} />
          </div>

          {/* Nutrition Facts */}
          <div>
            <label className="text-sm mb-2 block">Nutrition Facts (per serving)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.keys(formData.nutritionFacts).map((key) => (
                <input
                  key={key}
                  name={key}
                  value={formData.nutritionFacts[key]}
                  onChange={handleNutritionChange}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  className={inputClass}
                />
              ))}
            </div>
          </div>

          {/* Food Preference */}
          <div>
            <label className="text-sm mb-2 block">Food Preference</label>
            <div className="flex flex-wrap gap-2">
              {foodOptions.map((option) => (
                <span
                  key={option}
                  onClick={() => toggleSelection('foodPreference', option)}
                  className={`px-3 py-1 text-sm rounded-full cursor-pointer border transition duration-150
                    ${formData.foodPreference.includes(option)
                      ? 'bg-emerald-500 text-black'
                      : 'bg-white/10 text-white'}`}
                >
                  {option}
                </span>
              ))}
            </div>
          </div>

          {/* Allergens */}
          <div>
            <label className="text-sm mb-2 block">Allergens</label>
            <div className="flex flex-wrap gap-2">
              {allergenOptions.map((option) => (
                <span
                  key={option}
                  onClick={() => toggleSelection('allergens', option)}
                  className={`px-3 py-1 text-sm rounded-full cursor-pointer border transition duration-150
                    ${formData.allergens.includes(option)
                      ? 'bg-red-500 text-black'
                      : 'bg-white/10 text-white'}`}
                >
                  {option}
                </span>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm block mb-2">Upload Recipe Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  recipeImage: e.target.files[0],
                }))
              }
              className="text-white"
            />
          </div>

          {/* Submit */}
          <button
          disabled={apiCalled}
            type="submit"
            className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-3 rounded-lg transition duration-200"
          >
          {apiCalled?'Sumbiting':'Submit Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;
