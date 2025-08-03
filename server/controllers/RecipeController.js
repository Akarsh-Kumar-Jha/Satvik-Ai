const Recipe = require("../models/Recipe");
const User = require("../models/User");
const { uploadFileToCloudinary } = require("../utils/UploadFileToCloudinary");

exports.createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      tags,
      createdBy,
      image,
      nutritionFacts,
      foodPreference,
      allergens,
    } = req.body;

    const { id: userId, role } = req.user;

    if (
      !title ||
      !description ||
      !ingredients.length ||
      !instructions.length ||
      !prepTime ||
      !cookTime ||
      !tags.length ||
      !nutritionFacts ||
      !foodPreference.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Please Give All Details Required!",
      });
    }

const parseIfString = (value) =>
  typeof value === "string" ? JSON.parse(value) : value;

const parsedIngredients = parseIfString(ingredients);
const parsedInstructions = parseIfString(instructions);
const parsedTags = parseIfString(tags);
const parsedFoodPreference = parseIfString(foodPreference);
const parsedAllergens = parseIfString(allergens);
const parsedNutritionFacts = parseIfString(nutritionFacts);
const parsedTitle = typeof title === "string" ? title.replace(/^"(.*)"$/, "$1") : title;




if (!req.files || !req.files.recipeImage) {
  return res.status(400).json({
    success: false,
    message: "Recipe Image Not Uploaded!",
  });
}

const recipeImage = req.files.recipeImage;

    if (!userId || !role) {
      return res.status(403).json({
        success: false,
        message: "User Not Authenticated!",
      });
    }

    if (role !== "Nutritionist") {
      return res.status(403).json({
        success: false,
        message: "Protected Route For nutritionist Only",
      });
    }

    const uploadedImage = await uploadFileToCloudinary(recipeImage,'Recipes');

    if(!uploadedImage.secure_url){
        return res.status(500).json({
            success:false,
            message:"Error While Uploading Recipe Image!"
        });
    };

   const newRecipe = await Recipe.create({
  title: parsedTitle,
  description,
  ingredients: parsedIngredients,
  instructions: parsedInstructions,
  prepTime,
  cookTime,
  tags: parsedTags || [],
  createdBy: userId,
  image: uploadedImage.secure_url,
  nutritionFacts: parsedNutritionFacts,
  foodPreference: parsedFoodPreference || [],
  allergens: parsedAllergens || [],
});


    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: { recipesCreated: newRecipe._id },
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Recipe Created SuccessFully.",
      newRecipe,
      updatedUser,
      uploadedImage
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error While Creating Recipe!",
      error: error.message,
    });
  }
};

exports.deleteRecipe = async(req,res) => {
    try {
        
        const {recipeId} = req.body;
        if(!recipeId){
              return res.status(400).json({
            success:false,
            message:"RecipeId Not Found",
        });
        }

        const {id:userId,role} = req.user;
        if(!userId){
             return res.status(403).json({
            success:false,
            message:"User Not Authenticated",
        });
        };

        if(role !== "Nutritionist"){
                return res.status(403).json({
            success:false,
            message:"Protected Route For Nutritionist Only",
        });
        };

        const recipeFind = await Recipe.findById(recipeId);
        if(!recipeFind){
            return res.status(400).json({
                success:false,
                message:"Recipe Not Found!"
            });
        };

        if (recipeFind.createdBy.toString() !== userId) {
  return res.status(403).json({
    success: false,
    message: "You can only delete your own recipes!",
  });
}

        const updatedUser = await User.findByIdAndUpdate(userId, {
        $pull: { recipesCreated: recipeFind._id.toString() },
      },{new:true});

        const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);

        return res.status(200).json({
            success:true,
            message:"Succesfully Deleted Recipe",
            deletedRecipe,
            updatedUser,
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error While Deleting Recipe",
            error:error.message
        });
    };
}

exports.saveRecipe = async(req,res) => {
    try {
        
        const {recipeId} = req.body;

        if(!recipeId){
            return res.status(400).json({
                success:false,
                message:"Recipe Id Not Given!"
            });
        };

        const {id:userId} = req.user;
        if(!userId){
            return res.status(403).json({
                success:false,
                message:"User Not Authenticated!"
            });
        };
        const recipeFind = await Recipe.findById(recipeId);

        if(!recipeFind){
            return res.status(400).json({
                success:false,
                message:"Recipe Not Found!"
            });
        };

        const updatedUser = await User.findByIdAndUpdate(userId,{
            $addToSet: { savedRecipes: recipeFind._id }
        },{new:true});


        return res.status(200).json({
            success:true,
            message:"Succesfully Recipe Saved",
            updatedUser
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error While Saving Recipe!",
            error:error.message
        });
    }
}

exports.findRecipe = async (req,res) => {
    try {
        const recipeId = req.params.id;
        if(!recipeId){
             return res.status(500).json({
            success:false,
            message:"Recipe Id Not Given!",
        });
        };

        const recipe = await Recipe.findById(recipeId).populate('createdBy');
        if(!recipe){
            return res.status(400).json({
                success:false,
                message:"Given Recipe Not Found!"
            });
        };

        return res.status(200).json({
            success:true,
            message:"Feched Recipe Sucessfully.",
            recipe
        });
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error While Finding Recipe!",
            error:error.message
        });
    };
}

exports.getAllRecipes = async(req,res) => {
    try {
        const AllRecipes = await Recipe.find().populate('createdBy');
        if(AllRecipes.length === 0){
            return res.status(200).json({
                success:true,
                message:"No Recipes Found!",
                data:[]
            });
        };

        return res.status(200).json({
            success:true,
            message:"Fetched All Recipes",
            data:AllRecipes
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error While Fetching Recipes!",
            error:error.message
        });
    };
}
