const express = require('express');
const authMiddleware = require('../middlewares/auth');
const { isNutritionist } = require('../middlewares/isNutritionist');
const {isUser} = require('../middlewares/isUser');
const { createRecipe, deleteRecipe, saveRecipe, findRecipe, getAllRecipes } = require('../controllers/RecipeController');
const router = express.Router();

router.post('/add-recipe',authMiddleware,isNutritionist,createRecipe);
router.delete('/delete-recipe',authMiddleware,isNutritionist,deleteRecipe);
router.post('/save-recipe',authMiddleware,isUser,saveRecipe);
router.get('/get/:id',authMiddleware,findRecipe);
router.get('/get-recipes',getAllRecipes);

module.exports = router;