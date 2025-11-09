import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import MainLogo from "../assets/images/MainLogo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { authClient} from "../utils/auth_client";
import { toast } from "react-toastify";
import MoonLoader from "react-spinners/MoonLoader";

export const Navbar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {data: session} = authClient.useSession();
  console.log("Session data in Navbar.jsx:", session);

  const navItems = [
    { name: "Home", to: "/" },
    { name: "Tools", to: "/tools" },
    { name: "Contact", to: "/contact" },
    { name: "About", to: "/about" }
  ];

  return (
    <>
      <nav className="mt-4 py-3 px-4 sm:px-6 m-auto backdrop-blur-md bg-white/5 rounded-2xl max-w-6xl border border-white/10 shadow-lg">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <img className="w-10 h-10 sm:w-12 sm:h-12" src={MainLogo} alt="Simpl AI Logo"/>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex justify-center gap-8 items-center text-base lg:text-lg text-white/60 font-medium">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.to}
                  className={({isActive})=>`hover:text-white ${isActive && 'text-white'} transition-all duration-300 relative group`}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </NavLink>
              </li>
            ))}
            {session?<>
              <button onClick={async(e)=>{
                e.preventDefault();
                await authClient.signOut({
                  fetchOptions:{
                    onRequest: (ctx)=>{
                      setLoading(true);
                    },
                    onResponse: (ctx)=>{
                      setLoading(false);
                    },
                    onSuccess: (ctx)=>{
                      toast.success("Logged out successfully");
                      navigate("/login");
                    },
                    onError: (ctx)=>{
                      toast.error("Error signing out: " + ctx.error.message);
                    }

                  }
                })


              }}
              disabled={loading}
              className={`flex justify-center items-center text-white disabled:opacity-50 ${session.session?'bg-gray-500 hover:bg-gray-800':'bg-sky-400 hover:bg-sky-700'}  hover:border hover:border-gray-200 transition-colors py-2 px-4 rounded-lg`}>
                <span className={`${loading && 'hidden'}`}>Logout</span>

                {loading && <MoonLoader size={16} color="#b3ffba" />}
              </button>
            
            </>: <button className="bg-sky-400 text-white hover:bg-sky-700 hover:border hover:border-gray-200 transition-colors py-2 px-4 rounded-lg">Login</button>}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white/80 hover:text-white transition-colors p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10">
            <ul className="flex flex-col gap-3">
              {navItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.to}
                    className={({isActive})=>`block py-2 px-4 ${isActive && 'text-white'} text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 font-medium`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
      
      {/* Divider */}
      <div className="mt-2 mx-auto max-w-6xl h-[0.05rem] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </>
  );
};

export default Navbar;