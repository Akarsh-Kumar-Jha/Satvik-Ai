import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import toast from "react-hot-toast"; 
import { logout } from "../redux/slices/AuthSlice";

function UserProfile() {
  const user = useSelector((state) => state.auth.User);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    if (user?.Image) setImage(user.Image);
    if (user?.email) setEmail(user.email);
    if (user?.name) setName(user.name);
    if (user?.savedRecipes?.length > 0) setSavedRecipes(user.savedRecipes);
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-950 text-white px-6 py-12 font-inter">
      <div className="max-w-4xl mt-[30%] md:mt-[10%] mx-auto bg-zinc-900/50 border border-white/10 rounded-2xl p-8 shadow-lg relative">
     <button
  onClick={logoutHandler}
  className="absolute top-10 md:top-4 right-4 text-sm bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition"
>
  🔒 Logout
</button>

        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2">
          <img
            src={image}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-lime-400 object-cover shadow-lg"
          />
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-lime-400 mb-2">{name}</h2>
          <p className="text-white/70">{email}</p>
        </div>

        <hr className="my-8 border-white/10" />

        <div>
          <h3 className="text-xl font-semibold text-emerald-400 mb-4">📚 Saved Recipes</h3>
          {savedRecipes.length === 0 ? (
            <p className="text-white/60">You have no saved recipes yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedRecipes.map((item, index) => (
                <div
                  onClick={() => navigate(`/nutritionist/recipe/${item._id}`)}
                  key={index}
                  className="bg-gradient-to-tr from-zinc-800 to-black border border-white/10 rounded-xl p-4 hover:border-lime-400 transition cursor-pointer"
                >
                  <h4 className="text-lg font-medium text-lime-300">{item.title}</h4>
                  <p className="text-sm text-white/70 mt-1">{item.description || "No description available."}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;