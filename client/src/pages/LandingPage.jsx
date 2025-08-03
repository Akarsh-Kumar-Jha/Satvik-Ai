import React from "react";
import Navbar from "../components/common/Navbar";
import FeatureCard from "../components/common/FeatureCard";
import RecipeCard from "../components/common/RecipeCard";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const dummyRecipes = [
    {
      id: 1,
      title: "Satvik Khichdi Bowl",
      description: "A wholesome one-pot meal with moong dal, rice, seasonal veggies, and mild satvik spices — zero onion or garlic.",
      image: "https://www.goodgutayurveda.com/wp-content/uploads/2023/11/Dal-Basic-Khichdi-1200-18-edited.jpg",
      tags: ["High Protein", "Easy Digest", "Ayurvedic"],
      calories: "320 kcal",
      cookTime: "25 mins",
    },
    {
      id: 2,
      title: "Green Protein Smoothie",
      description: "Spinach, banana, soaked almonds, chia seeds and plant-based protein — perfect for energy and gut health.",
      image: "https://tse3.mm.bing.net/th/id/OIP.e9MiIn5DJ0HZBHZN1QqGIwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
      tags: ["Vegan", "Energy Boost", "Morning"],
      calories: "180 kcal",
      cookTime: "5 mins",
    },
    {
      id: 3,
      title: "Paneer Tikka Salad",
      description: "Grilled paneer cubes, mixed greens, pomegranate, and lemon-mint dressing. Tandoori flavour, guilt-free nutrition.",
      image: "https://www.gohealthyeverafter.com/wp-content/uploads/2022/10/Paneer-tikka-salad-21.jpg",
      tags: ["High Protein", "Low Carb", "Indian Fusion"],
      calories: "260 kcal",
      cookTime: "15 mins",
    },
    {
      id: 4,
      title: "Ragi Dosa with Coconut Chutney",
      description: "Crispy ragi dosa served with fresh coconut chutney — fiber-rich, diabetic-friendly, and south Indian soul food.",
      image: "https://i.pinimg.com/736x/32/e2/14/32e214456c14edf54f680830588c9cab.jpg",
      tags: ["Gluten-Free", "Breakfast", "South Indian"],
      calories: "290 kcal",
      cookTime: "20 mins",
    },
  ];
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#0f0f0f] overflow-hidden flex flex-col items-center">
      <div className="absolute top-[-10%] right-[-15%] w-[450px] h-[450px] rounded-full bg-green-500 opacity-20 blur-3xl" />
      <div className="absolute top-[25%] left-[35%] w-[600px] h-[600px] rounded-full bg-blue-500 opacity-25 blur-[160px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-[#66C475] opacity-15 blur-2xl" />

      <Navbar showDashboard={true} />

      <div className="mt-[20%] md:mt-[5%] px-6 md:px-20 h-[calc(100vh-10vh)] w-full max-w-screen-xl flex flex-col md:flex-row justify-between items-center gap-y-10 gap-x-12">
        <div className="flex flex-col justify-center items-start gap-6 w-full md:w-1/2 text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-green-500 to-emerald-400">
            SatvikAI
          </h1>

          <p className="text-lg md:text-4xl text-gray-300 font-semibold">
            Your Personalized <span className="text-orange-400">Vegetarian</span><br /> Diet Planner Powered by AI
          </p>

          <p className="text-sm md:text-base text-gray-400">
            Discover healthy, balanced, and purely vegetarian meal plans curated by AI — based on your goals, preferences, and lifestyle.
          </p>

          <p className="text-sm md:text-base text-gray-400">
            Track your calories, stay hydrated, and eat right without overthinking. Made for Indian diets and mindful living.
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
            <button onClick={() => navigate('/dashboard/user')} className="px-6 py-3 bg-gradient-to-r from-lime-400 via-green-500 to-emerald-400 text-black font-semibold rounded-xl hover:scale-105 hover:shadow-[0_0_10px_#66C475] transition">
              Get Started
            </button>
            <button onClick={() => navigate('/features')} className="px-6 py-3 border border-white/30 text-white rounded-xl hover:bg-white/10 transition backdrop-blur-md">
              Learn More
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 z-10 flex justify-center">
          <img
            className="w-full max-w-[400px] drop-shadow-[0_0_20px_rgba(102,196,117,0.3)]"
            src="https://res.cloudinary.com/dlnzbkyit/image/upload/v1753342987/ChatGPT_Image_Jul_24_2025_01_08_32_PM_ih2cbn.png"
            alt="SatvikAI Hero"
          />
        </div>
      </div>

      <section className="w-full px-6 md:px-20 mt-20 max-w-screen-xl text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-lime-400 mb-12">
          Eat Better. Live Smarter. Feel Lighter.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard
            title="Personalized Veg Plans"
            desc="Get AI-tailored vegetarian meal plans based on your fitness goals, eating habits, and regional preferences."
            img="https://res.cloudinary.com/dlnzbkyit/image/upload/v1753266291/meal_mwpouc.png"
          />

          <FeatureCard
            title="Food Photo → Nutrition"
            desc="Click a photo of your plate and instantly get detailed calorie & nutrient breakdown using AI analysis."
            img="https://res.cloudinary.com/dlnzbkyit/image/upload/v1753266202/calories_mlekok.png"
          />

          <FeatureCard
            title="Indian Satvik System"
            desc="Built on Ayurvedic principles — includes seasonal, sattvic food guidance with desi ingredient insights."
            img="https://res.cloudinary.com/dlnzbkyit/image/upload/v1753266420/thali_apjdu4.png"
          />

          <FeatureCard
            title="Smart Recipe Generator"
            desc="Tell us what you have — AI will generate tasty, healthy vegetarian recipes in seconds. Zero wastage, full flavor."
            img="https://res.cloudinary.com/dlnzbkyit/image/upload/v1753266621/recipe-book_ljjwzp.png"
          />
        </div>
      </section>

      <section className="w-full px-6 md:px-20 py-20 mt-10 bg-[#0f0f0f] text-white text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-lime-400 mb-12">
          How SatvikAI Works — Simple, Smart, Satvik.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StepCard title="1. Tell Us About You" delay="0" desc="Set your age, goals, eating preferences & lifestyle so our AI knows you better." />
          <StepCard title="2. Click Your Plate" delay="150" desc="Upload a meal photo or tell what’s in your kitchen — no more guessing calories." />
          <StepCard title="3. Get Smart Guidance" delay="300" desc="SatvikAI gives your meal plan, nutrition score, hydration reminder & more." />
          <StepCard title="4. Track. Learn. Glow." delay="450" desc="Get daily progress, weekly streaks, and feel light & energized every day." />
        </div>
      </section>

      <section className="w-full px-6 md:px-20 mt-10 mb-20 max-w-screen-xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-lime-400 mb-10">
          Handpicked Vegetarian Recipes — Tasty, Satvik & Smart
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {dummyRecipes.map((recipe, index) => (
            <RecipeCard
              key={index}
              title={recipe.title}
              image={recipe.image}
              description={recipe.description}
              tags={recipe.tags}
              calories={recipe.calories}
              cookTime={recipe.cookTime}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

const StepCard = ({ title, desc, delay }) => (
  <div
    data-aos="fade-up"
    data-aos-delay={delay}
    className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-md hover:shadow-[0_0_25px_rgba(102,196,117,0.3)] transition duration-300"
  >
    <h3 className="text-2xl font-semibold text-lime-300 mb-2">{title}</h3>
    <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;