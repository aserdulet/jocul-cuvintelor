import React from "react";
import { Link } from "react-router-dom";


function Navbar({ onLogout }) {
  return (
    <header className="bg-black text-gray-200 py-4 px-4 md:px-8">
    <div className="container mx-auto">
      <div className="flex justify-between items-center">
        <div className="text-orange-500 font-semibold text-lg">
          Jocul Cuvintelor
        </div>
        <nav className="space-x-4">
          <Link to="/home" className="text-gray-200 hover:text-orange-500">
            Home
          </Link>
          <Link
            to="/leaderboard"
            className="text-gray-200 hover:text-orange-500"
          >
            Leaderboard
          </Link>
          <Link to="/admin" className="text-gray-200 hover:text-orange-500">
            Admin
          </Link>
          <button
            onClick={onLogout}
            className="bg-orange-500 py-2 px-4 rounded-md text-black font-semibold text-sm"
          >
            Logout
          </button>
        </nav>
      </div>
    </div>
  </header>
  );
}

export default Navbar;