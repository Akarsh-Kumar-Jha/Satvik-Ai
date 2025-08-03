const { GoogleGenAI } = require("@google/genai");
const AiSuggestion = require("../models/AiSuggestion");
const User = require("../models/User");
const { uploadFileToCloudinary } = require("../utils/UploadFileToCloudinary");
require("dotenv").config();

exports.createMealPlan = async (req, res) => {
  try {
    const {
      age,
      gender,
      height,
      weight,
      activityLevel,
      preferredFood,
      allergen,
      mealsPerDay,
      goal,
    } = req.body;
    console.log("Data From FrontEnd For Meal Creation -> ",mealsPerDay);
    const { id: userId } = req.user;
    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "User Not Authenticated!",
      });
    }

    if (
      !age ||
      !gender ||
      !height ||
      !weight ||
      !activityLevel ||
      !mealsPerDay ||
      !goal
    ) {
      return res.status(400).json({
        success: false,
        message: "please Provide All Details",
      });
    }

    if (preferredFood.length === 0) {
      return res.status(400).json({
        success: false,
        message: "please Provide All Details",
      });
    }

    if( allergen.length === 0 ){
      allergen[0] = "None";
    }

    const prompt = `
You are a vegetarian dietician assistant.

Create a personalized vegetarian meal plan using the following user details:

### USER PROFILE:
- Age: ${age}
- Gender: ${gender}
- Height: ${height} cm
- Weight: ${weight} kg
- Activity Level: ${activityLevel}
- Goal: ${goal}
- Preferred Food Categories: ${preferredFood.join(", ")}
- Allergens: ${allergen.join(", ")}
- Meals Per Day: ${mealsPerDay}

### INSTRUCTIONS:
1. For each meal (based on mealsPerDay), generate:
   - name
   - description
   - prepTime (in minutes)
   - calories (in kcal)
   - ingredients (array of strings)
   - tags (e.g., "Low Carb", "Jain", "High Protein")

2. Follow these rules:
   - Avoid any allergen ingredients.
   - Use only vegetarian items.
   - Match the user's dietary preference and goal.
   - Total calories should align with user's goal and activity level.

3. Add a summary object at the end:
   - totalCalories (in kcal)
   - protein (in grams)
   - carbs (in grams)
   - fat (in grams)

### OUTPUT FORMAT (IMPORTANT):
Return only a clean JSON object exactly like this:
{
  "summary": {
    "totalCalories": "...",
    "protein": "... g",
    "carbs": "... g",
    "fat": "... g"
  },
  "meals": [
    {
      "time": "Meal 1",
      "dish": {
        "name": "...",
        "description": "...",
        "prepTime": "... mins",
        "calories": "... kcal",
        "tags": ["...", "..."],
        "ingredients": ["...", "..."]
      }
    }
    // More meals
  ]
}

DO NOT include any explanation, introduction, or text outside the JSON.
JUST RETURN the JSON object only.
`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${prompt}`,
      });
      console.log(response.text);
      let cleanText = response.text
        .replace(/```json\n?/, "")
        .replace(/```$/, "")
        .trim();

      let parsedData;
      try {
        parsedData = JSON.parse(cleanText);
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Invalid JSON in response.text",
          error: err.message,
        });
      }

      const newSuggestion = await AiSuggestion.create({
        user: userId,
        type: "MealPlan",
        inputUsed: {
          age,
          gender,
          weightKg: weight,
          heightCm: height,
          activityLevel: activityLevel,
          goal,
          foodPreferences: preferredFood,
          allergies: allergen,
        },
        AiResponse: parsedData,
      });

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $push: { AiSuggestion: newSuggestion._id },
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Created.",
        data: parsedData,
        updatedUser,
        newSuggestion,
      });
    } catch (error) {
      console.error("Error Occuered In Gemini:- ", error);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error While Creating Meal Plan!",
      error: error.message,
    });
  }
};

exports.getParticularMeal = async (req, res) => {
  try {
    const { suggestionId, mealNo } = req.body;
    console.log(suggestionId, mealNo);
    if (!suggestionId || !mealNo) {
      return res.status(400).json({
        success: false,
        message: "Please Provide All Details",
      });
    }

    const MealDetails = await AiSuggestion.findById(suggestionId);
    const Details = MealDetails?.AiResponse?.meals[mealNo];

    if (!Details) {
      return res.status(403).json({
        success: false,
        message: "Given Meal Not Found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Succesfully Fetched Meal Details",
      Meal: Details,
      suggestionId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error Occuered While Fetching This Meal",
      error: error.message,
    });
  }
};

exports.generateDeatiledMeal = async (req, res) => {
  try {
    const { mealData, suggestionId, UserName } = req.body;
    const { name, description, prepTime, calories, ingredients } = mealData;
    console.log("UserName :- ", UserName);
    if (!name || !description || !prepTime || !calories) {
      return res.status(400).json({
        success: false,
        message: "Please Provide All Details!",
      });
    }

    if (ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Ingridents Not Found!",
      });
    }

    const suggestionDetsils = await AiSuggestion.findById(suggestionId);
    console.log("Full Suggestion DEtails_>", suggestionDetsils?.inputUsed);
    const { age, gender, weightKg, heightCm, goal, allergies } =
      suggestionDetsils?.inputUsed;

    // console.log("All Details -> ",{
    //   UserName,age,gender,heightCm,weightKg,goal,name,description,prepTime,calories,allergies,ingredients
    // });

    const prompt = `
You are a vegetarian nutritionist assistant AI.

Your task is to explain a specific vegetarian meal to the user **${UserName}** in a personalized, friendly, and simple way using both the meal and user profile provided below.

### USER PROFILE:
- Name: ${UserName}
- Age: ${age}
- Gender: ${gender}
- Height: ${heightCm} cm
- Weight: ${weightKg} kg
- Goal: ${goal}
- Allergies: ${allergies.length > 0 ? allergies.join(", ") : "None"}

### MEAL DETAILS:
- Name: ${name}
- Description: ${description}
- Prep Time: ${prepTime}
- Calories: ${calories}
- Ingredients: ${ingredients.join(", ")}

---

### YOUR TASK:
Return a VALID JSON ONLY with these keys:

1. **"explanation"**  
   → A short, friendly paragraph explaining the meal in simple language for **${UserName}**.

2. **"whyHelpful"**  
   → A list of bullet points explaining how this meal helps **${UserName}** specifically based on their goal and health profile.

3. **"stepsToCook"**  
   → A step-by-step beginner-friendly guide to cook this meal and - Do NOT use **bold** or Markdown formatting. Plain text only.
.

---

### RULES:
- Response must be **valid JSON only**.
- Do NOT include any extra text or commentary.
- JSON should be helpful, structured and human-readable.
`;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${prompt}`,
      });
      let cleanText = response.text
        .replace(/```json\n?/, "")
        .replace(/```$/, "")
        .trim();

      let parsedData;
      try {
        parsedData = JSON.parse(cleanText);
        console.log(parsedData);
         return res.status(200).json({
      success: true,
      message: "Generated Meal Deatails Succesfully.",
      data: parsedData,
    });
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Invalid JSON in response.text",
          error: err.message,
        });
      }
    } catch (error) {
      console.error("Error In Gemini", error.message);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error While Generating Meal Details!",
      error: error.message,
    });
  }
};


exports.getInfoFromImage = async (req,res) => {
  try {

    if(!req.files || !req.files.uploadedImage){
          return res.status(400).json({
      success:false,
      message:"Image Not Uploaded!",
    });
    }

    const uploadedImage = req.files.uploadedImage;

    const c_response = await uploadFileToCloudinary(uploadedImage,"MealIdeas");
    if(!c_response.secure_url){
      return res.status(400).json({
        success:false,
        message:"Image Not Uploaded!",
        error:c_response.error
      });
    };

    console.log("Secure Url:-> ",c_response.secure_url);




async function main() {
  try{
 const ai = new GoogleGenAI({});

  const imageUrl = `${c_response.secure_url}`;

  const response = await fetch(imageUrl);
  const imageArrayBuffer = await response.arrayBuffer();
  const base64ImageData = Buffer.from(imageArrayBuffer).toString('base64');

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64ImageData,
      },
    },
    { text: `You are a vegetarian nutrition expert. Analyze the uploaded image and respond only if the food is 100% vegetarian. If possible, include estimated quantity or level of nutrients (e.g., High/Medium/Low or grams/mg per serving if identifiable). Return the result in the following strict JSON format: ...  {
  "dish_name": "Name of the vegetarian dish (or best guess)",
  "health_benefits": "List and explain the main health benefits",
 "nutrients": {
    "proteins": "Amount or level (e.g., High – from paneer, 15g per serving)",
    "vitamins": "Main vitamins with level/role (e.g., Vitamin A - Moderate - supports vision)",
    "minerals": "Key minerals with level (e.g., Calcium - High - good for bones)",
    "fiber": "Fiber level or estimation (e.g., Low, 2g per serving)",
    "others": "Other key components (e.g., Healthy fats - Medium, Lycopene - Antioxidant)"
  },
  "demerits": "Mention any side-effects or drawbacks of overconsumption or wrong use",
  "misuse_cases": "Ways this item could be misused (e.g., non-veg look-alike, harmful combinations, excessive use)",
  "vegetarian": true
}

If the food is non-vegetarian or unclear, return:

{
  "vegetarian": false,
  "message": "Non-vegetarian or unclear item. I cannot process this as per dietary restrictions."
}

Avoid extra text. No explanation outside the JSON block. Be simple, accurate, and clear for use in a nutrition-based app.` }
  ],
  });
  
  let cleanText = result.text
        .replace(/^```json\s*|\s*```$/g, '')
        .trim();

      let parsedData;
      try {
        parsedData = JSON.parse(cleanText);
        console.log("Final Response-> ",parsedData);
         return res.status(200).json({
      success: true,
      message: "Generated Meal Deatails Succesfully.",
      data: parsedData,
    });
  }catch(error){
     return res.status(500).json({
          success: false,
          message: "Invalid JSON in response.text",
          error: err.message,
        });
  }
  }catch(error){
console.error("Error Occuered In Gemini!",error.message);
  }
}

main();

    
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Error While Genrating Idea Of Meal!",
      error:error.message
    });
  };
}
