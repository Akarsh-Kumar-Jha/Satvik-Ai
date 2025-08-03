import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const AllRecipes = (fetchUser) => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [activeTag, setActiveTag] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchRecipes = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/recipe/get-recipes', {
          withCredentials: true,
        });

        const allFetchedRecipes = res.data.data || [];
        const uniqueTags = new Set();

        allFetchedRecipes.forEach((item) => {
          item.tags.forEach((tag) => {
            uniqueTags.add(tag.toLowerCase());
          });
        });

        setRecipes(allFetchedRecipes);
        setFilteredRecipes(allFetchedRecipes);
        setAllTags([...uniqueTags]);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleTagClick = (tag) => {
    if (tag === activeTag) {
      setActiveTag('');
      setFilteredRecipes(recipes);
    } else {
      setActiveTag(tag);
      const filtered = recipes.filter((recipe) =>
        recipe.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <span className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#0f0f0f] via-[#111827] to-[#0f0f0f] text-white px-4 md:px-12 py-10">
      <Navbar showDashboard={true} />

      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-15%] w-[250px] h-[250px] rounded-full bg-green-500 opacity-20 blur-3xl z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] rounded-full bg-blue-500 opacity-25 blur-[160px] z-0" />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto mt-[9%]">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-lime-300 via-emerald-400 to-green-400 bg-clip-text text-transparent">
          All Recipes
        </h1>

        {/* Tag Filters */}
        <div className="mb-10 flex flex-wrap gap-3 justify-center">
          {allTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-1.5 rounded-full border text-sm transition-all duration-200 font-medium ${
                activeTag === tag
                  ? 'bg-lime-400 text-black shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Recipe Cards */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-white/5 p-4 rounded-2xl shadow-md border border-white/10 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 hover:border-lime-400"
                onClick={() => navigate(`/nutritionist/recipe/${recipe._id}`)}
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover rounded-xl mb-4 shadow"
                />
                <h2 className="text-lg font-semibold text-lime-300 line-clamp-1">{recipe.title}</h2>
                <p className="text-gray-400 text-sm line-clamp-2 mb-2">{recipe.description}</p>
                <div className="text-xs text-gray-500">
                  ⏱ {recipe.prepTime + recipe.cookTime} mins | 👤 {recipe.createdBy.name}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gradient-to-r from-lime-400 to-emerald-400 text-black font-semibold rounded-full shadow-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">😔 No recipes found for selected tag.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRecipes;
