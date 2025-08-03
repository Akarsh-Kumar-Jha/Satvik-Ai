import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = ({showDashboard}) => {
  console.log("ShowDashBoard In Navbar.jsx -> ",showDashboard);
  const navigate = useNavigate();
  const LoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.User);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
 <div className="w-full h-[80px] fixed z-50 top-0 left-0 bg-transparent px-4 md:px-10 py-3 flex justify-between items-center poppins-font">
  {/* Logo */}
  <div onClick={() => navigate('/')} className="flex items-center h-[150px] w-[200px]">
    <img
      className="object-contain h-[100%] w-[100%]"
      src="https://res.cloudinary.com/dlnzbkyit/image/upload/v1753219931/SatvikAi_Logo_h9lxxc.png"
      alt="SatvikAI Logo"
    />
  </div>

      {/* Hamburger Icon - Mobile */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}
        </button>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex flex-row justify-center items-center text-white bg-white/10 border border-white/10 gap-x-8 rounded-3xl px-6 py-3">
        <NavLink to="/" className="hover:text-lime-300 transition">Home</NavLink>
        <NavLink to="/features" className="hover:text-lime-300 transition">Features</NavLink>
        <NavLink to="/all-recipes" className="hover:text-lime-300 transition">Recipes</NavLink>
        <NavLink to="/contact" className="hover:text-lime-300 transition">Contact</NavLink>
      </div>

      {/* Buttons / Avatar Section */}
      <div className="hidden md:flex items-center gap-x-4">
        {!LoggedIn ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-lg border border-white/30 text-white hover:bg-white/10 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-lime-400 to-emerald-500 text-black font-semibold hover:shadow-md transition"
            >
              Get Started
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate(`/dashboard/${user?.role.toLowerCase()}`)}
              className={` ${!showDashboard ? "hidden":'block'} px-4 py-2 rounded-lg border border-white/30 text-white hover:bg-white/10 transition`}
            >
              Dashboard
            </button>
            <img
               onClick={() => navigate('/User-profile')}
              src={user?.Image}
              alt="avatar"
              className="h-10 w-10 cursor-pointer rounded-full border border-lime-300 object-cover"
            />
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-[80px] left-0 w-full flex flex-col items-center gap-4 text-white bg-black/80 py-6 z-40 md:hidden">
          <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/features" onClick={() => setMenuOpen(false)}>Features</NavLink>
          <NavLink to="/all-recipes" onClick={() => setMenuOpen(false)}>Recipes</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>

          {!LoggedIn ? (
            <>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/login");
                }}
                className="px-4 py-2 rounded-lg border border-white/30 text-white hover:bg-white/10 transition"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/signup");
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-lime-400 to-emerald-500 text-black font-semibold hover:shadow-md transition"
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate(`/dashboard/${user?.role.toLowerCase()}`);
                }}
                className={`${!showDashboard ? "hidden":'block'} px-4 py-2 rounded-lg border border-white/30 text-white hover:bg-white/10 transition`}
              >
                Dashboard
              </button>
              <img
                onClick={() => navigate('/User-profile')}
                src={user?.Image}
                alt="avatar"
                className="h-12 w-12 cursor-pointer rounded-full border border-lime-300 object-cover"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;