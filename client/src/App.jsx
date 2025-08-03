import React, { useEffect } from 'react'
import { Routes,Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AOS from 'aos';
import 'aos/dist/aos.css';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import NutritionistDashboard from './pages/NutritionistDashboard';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login, setLoading } from "./redux/slices/AuthSlice";
import FullRecipeCard from './pages/FullRecipeCard';
import AllRecipes from './components/common/AllRecipes';
import CreateRecipe from './pages/CreateRecipe';
import FullMealPLan from './pages/FullMealPLan';
import ImageInsights from './pages/ImageInsights';
import UserProfile from './pages/UserProfile';
import GetMeal from './pages/GetMeal';
import Unauthorized from './pages/Unauthorized';
import RoleProtectedRoute from './components/common/RoleProtectedRoute';
import Features from './pages/Features';
import Contact from './pages/Contact';
import { axiosInstance } from './axios/axiosInstance';


const App = () => {

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
  AOS.init({
    duration: 800,
    once: true,
  });


const fetchUser = async() => {
  try {
    const response = await axiosInstance.get('/get-user');
    console.log("Response In App.jsx ->",response.data.data);
    dispatch(login(response.data.data));
  } catch (error) {
    console.log("Error Occuered In App.jsx -> ",error);
    dispatch(setLoading());
  }
}
fetchUser();

}, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white bg-[#0f0f0f]">
        <span className="animate-spin w-10 h-10 border-4 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
<Routes>
  <Route path='/' element={<LandingPage/>} />
  <Route path='/signup' element={<Signup/>} />
  <Route path='/verify-email' element={<VerifyEmail/>} />
  <Route path='/login' element={<Login/>} />
  <Route path='/features' element={<Features/>} />
  <Route path='/contact' element={<Contact/>} />
  <Route element={<RoleProtectedRoute allowedRoles={['Nutritionist']} />}>
   <Route path='/dashboard/nutritionist' element={<NutritionistDashboard/>} />
  </Route>
  <Route element={<RoleProtectedRoute allowedRoles={['User','Admin','Nutritionist']} />}>
    <Route path='/nutritionist/recipe/:id' element={<FullRecipeCard />} />
  </Route>
  <Route path='/all-recipes' element={<AllRecipes/>} />

  <Route element={<RoleProtectedRoute allowedRoles={['Nutritionist']} />}>
    <Route path='/nutritionist/create-recipe' element={<CreateRecipe/>} />
  </Route>


  <Route element={<RoleProtectedRoute allowedRoles={['Admin']} />}>
<Route path='/dashboard/admin' element={<AdminDashboard/>} />
  </Route>
  
  <Route element={<RoleProtectedRoute allowedRoles={['User']} />}>
    <Route path='/dashboard/user' element={<UserDashboard/>} />
  </Route>
  
 <Route element={<RoleProtectedRoute allowedRoles={['User']} />}>
   <Route path='/meal/:suggesationId' element={<FullMealPLan />} />
 </Route>
  <Route element={<RoleProtectedRoute allowedRoles={['User']} />}>
  <Route path='/get-nutrition-insight' element={<ImageInsights />} />
  </Route>
  <Route element={<RoleProtectedRoute allowedRoles={['User','Admin','Nutritionist']} />}>
  <Route path='/User-profile' element={<UserProfile/>} />
  </Route>

  <Route element={<RoleProtectedRoute allowedRoles={['User']} />}>
  <Route path='/generate-meal' element={<GetMeal/>} />
  </Route>
  <Route path='/unauthorized' element={< Unauthorized />} />
</Routes>

  )
}

export default App