const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema(
  {
    age: {
      type: Number,
      min: 5,
      max: 100,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    weightKg: {
      type: Number,
      min: 30,
      max: 250,
    },
    heightCm: {
      type: Number,
      min: 100,
      max: 250,
    },
    activityLevel: {
      type: String,
      enum: ["Sedentary", "Light", "Moderate", "Active", "Very Active"],
    },
    goal: {
      type: String,
      enum: ["Lose Weight", "Maintain", "Gain Muscle", "Detox"],
    },
    foodPreferences: {
      type: [String],
      enum: [
        "Pure Satvik", // No onion, garlic, caffeine, etc. – Ayurvedic
        "Jain", // No root vegetables (like onion, garlic, potato)
        "Gluten-Free", // Avoids wheat, barley, rye
        "Ayurvedic", // Based on body type: Vata, Pitta, Kapha
        "Low Carb Veg", // Low carbohydrates, high fats/proteins
        "Diabetic Friendly", // Low GI, sugar-conscious veg meals
        "Balanced Veg", // Normal balanced vegetarian meals
      ],
    },
    allergies: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", UserProfileSchema);
