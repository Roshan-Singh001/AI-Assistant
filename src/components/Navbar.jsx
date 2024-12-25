import React from "react";

export const Navbar = () => {
  return (
    <>
      <nav className="bg-slate-900 text-white py-4 px-2">
        <ul className="flex justify-between items-center">
          <div className="text-2xl font-extrabold">
            <span>SIMPL-AI</span>
          </div>
          <div className="flex items-center gap-4">
            <li className="bg-white text-slate-700 shadow-[0px_-2px_7px_black_inset] font-bold py-2 px-4 rounded-2xl cursor-pointer"><button>LOGIN/SIGNUP</button></li>
          </div>
        </ul>
      </nav>
    </>
  );
};
export default Navbar;
