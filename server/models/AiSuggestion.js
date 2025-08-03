const mongoose = require("mongoose");

const AISuggestionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["MealPlan", "Hydration", "NutritionInsight", "Reminder"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  inputUsed: {
    age: Number,
    gender: String,
    weightKg: Number,
    heightCm: Number,
    activityLevel: String,
    goal: String,
    foodPreferences: [String],
    allergies: [String],
  },
  AiResponse: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
},{timestamps:true});

module.exports = mongoose.model('AiSuggestion',AISuggestionSchema);



