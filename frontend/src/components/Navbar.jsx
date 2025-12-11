import React, { useState } from "react";
import { Menu, X, User, LogOut, Trash2 } from "lucide-react";
import MainLogo from "../assets/images/MainLogo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { authClient } from "../utils/auth_client";
import { toast } from "react-toastify";
import MoonLoader from "react-spinners/MoonLoader";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = authClient.useSession();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogout = async (e) => {
    setLoading(true);
    e.preventDefault();
    await authClient.signOut({
      fetchOptions: {
        onRequest: (ctx) => {
          setLoading(true);
        },
        onResponse: (ctx) => {
          setLoading(false);
        },
        onSuccess: (ctx) => {
          toast.success("Logged out successfully");
          navigate("/login");
        },
        onError: (ctx) => {
          toast.error("Error signing out: " + ctx.error.message);
        }
      }
    }
    );

    setLoading(false);
  }

  const handleDeleteAccount = async(e) => {
    setShowDeleteConfirm(true);
    e.preventDefault();

    try {
      await authClient.deleteUser({
        callbackURL: "/",
      });
      
    } catch (error) {
      
    }
    
    console.log("Delete account clicked");

  }

  const navItems = [
    { name: "Home", to: "/" },
    { name: "Tools", to: "/tools" },
    { name: "About", to: "/about" }
  ];

  return (
    <>
      <nav className="relative z-50 mt-4 py-3 px-4 sm:px-6 m-auto backdrop-blur-md bg-white/5 rounded-2xl max-w-6xl border border-white/10 shadow-lg">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <img className="w-10 h-10 sm:w-12 sm:h-12" src={MainLogo} alt="Simpl AI Logo" />
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex justify-center gap-8 items-center text-base lg:text-lg text-white/60 font-medium">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `hover:text-white ${isActive && 'text-white'} transition-all duration-300 relative group`}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </NavLink>
              </li>
            ))}
            {session ? <>
              <div className="">
                <div className="relative">
                  {/* User Avatar Button */}
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-sky-300"
                    aria-label="User menu"
                  >
                    <User className="w-6 h-6 text-white" />

                    {/* Online indicator */}
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-[100]"
                        onClick={() => setIsOpen(false)}
                      />

                      {/* Menu Panel */}
                      <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-sky-500 to-sky-600 p-4 text-white">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{session.user?.name || 'User'}</h3>
                              <p className="text-sky-100 text-sm">{session.user?.email || 'user@example.com'}</p>
                            </div>
                            <button
                              onClick={() => setIsOpen(false)}
                              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                              aria-label="Close menu"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          {/* Logout Button */}
                          <button
                            onClick={(e)=>handleLogout(e)}
                            disabled={loading}
                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                          >
                            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 group-hover:bg-gray-200 rounded-lg transition-colors">
                              {loading ? (
                                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                              ) : (
                                <LogOut className="w-5 h-5 text-gray-600" />
                              )}
                            </div>
                            <span className="font-medium">Logout</span>
                          </button>

                          {/* Divider */}
                          <div className="my-2 border-t border-gray-100" />

                          {/* Delete Account Button */}
                          <button
                            onClick={()=>setShowDeleteConfirm(true)}
                            disabled={loading}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                          >
                            <div className="flex items-center justify-center w-10 h-10 bg-red-50 group-hover:bg-red-100 rounded-lg transition-colors">
                              <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                            <span className="font-medium">Delete Account</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Delete Confirmation Modal */}
                  {showDeleteConfirm && (
                    <>
                      <div className="fixed inset-0 bg-black/50 z-[150] flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                            <Trash2 className="w-6 h-6 text-red-600" />
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                            Delete Account?
                          </h3>

                          <p className="text-gray-600 text-center mb-6">
                            This action cannot be undone. All your data will be permanently deleted.
                          </p>

                          <div className="flex gap-3">
                            <button
                              onClick={() => setShowDeleteConfirm(false)}
                              disabled={loading}
                              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                              Cancel
                            </button>

                            <button
                              onClick={(e)=>handleDeleteAccount(e)}
                              disabled={loading}
                              className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {loading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                'Delete'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>


            </> : <button
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
              className="bg-sky-400 text-white hover:bg-sky-700 hover:border hover:border-gray-200 transition-colors py-2 px-4 rounded-lg">Login</button>}
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
                    className={({ isActive }) => `block py-2 px-4 ${isActive && 'text-white'} text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 font-medium`}
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