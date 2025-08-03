const express = require('express');
const { sendMailAndCacheData, verifyAndCreate, login, logout, refreshAccessToken, getUser } = require('../controllers/Auth');
const authMiddleware = require('../middlewares/auth');
const { isUser } = require('../middlewares/isUser');
const { createMealPlan, getParticularMeal, generateDeatiledMeal, getInfoFromImage } = require('../controllers/MealPlan');
const router = express.Router();


router.post('/signup',sendMailAndCacheData);
router.post('/verify-email',verifyAndCreate);
router.post('/login',login);
router.post('/logout',logout)
router.post('/refresh-token',refreshAccessToken);
router.get('/get-user',authMiddleware,getUser);
router.post('/generate-meal',authMiddleware,isUser,createMealPlan);
router.post('/get-meal-details',authMiddleware,isUser,getParticularMeal);
router.post('/generate-detailed-meal',authMiddleware,isUser,generateDeatiledMeal);
router.post('/get-data-from-image',authMiddleware,isUser,getInfoFromImage);

module.exports = router;