const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is Invalid"],
    trim: true,
    minlength: [3, "Title Must Be Minimum Of Three Characters"],
  },
  description: {
    type: String,
    required: [true, "Description is Invalid"],
    trim: true,
    minlength: [10, "Description Must Be Minimum Of Ten Characters"],
  },
  ingredients: {
    type: [String],
    required: [true, "Ingredients Cannot Be Empty"],
  },
  instructions: {
    type: [String],
    required: [true, "Instructions Cannot Be Empty"],
  },
  prepTime: {
    type: Number,
    required: [true, "Prepration Time Must be Given"],
    min: [0, "Prepration Time Cannot Be Less Than 0min"],
  },
  cookTime: {
    type: Number,
    required: [true, "Cooking Time Must be Given"],
    min: [2, "Cooking Time Cannot Be Less Than 2min"],
  },
  tags: {
    type: [String],
    default:[]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  image: {
    type: String,
    required: [true, "Recipe Image Must be Given"],
  },
  nutritionFacts: {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    fat: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
  },
  foodPreference: {
    type: [String],
    enum: [
      "Pure Satvik",
      "Jain",
      "Gluten-Free",
      "Ayurvedic",
      "Low Carb Veg",
      "Diabetic Friendly",
      "Balanced Veg",
    ],
    default: [],
  },
  allergens: {
    type: [String],
    enum: [
      "Gluten",
      "Dairy",
      "Nuts",
      "Soy",
      "Mustard",
      "Sesame",
      "Peanuts",
      "None",
    ],
    default: [],
  },
},{timestamps:true});

recipeSchema.virtual("totalTime").get(function () {
  return Number(this.prepTime) + Number(this.cookTime);
});

module.exports = mongoose.model("Recipe", recipeSchema);
