import { useState } from "react";
import { Link } from "react-router";
import { Menu } from "./Menu";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-gradient-to-r from-stone-800 to-amber-950 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-white cursor-pointer hover:text-yellow-400 focus:outline-none focus:text-gray-300 transition-colors duration-200"
                aria-label="Menu"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 flex justify-center">
              <Link to="/home" className="flex items-center">
                <img
                  src="/Logo.png"
                  alt="Logo"
                  className="h-15 w-auto hover:opacity-80 transition-opacity duration-200"
                />
              </Link>
            </div>

            <div className="flex items-center">
              <Link
                to="/carrinho"
                className="bg-gradient-to-br from-yellow-200 to-amber-400 font-semibold text-stone-900 transition-colors rounded shadow-md border border-amber-600 transition-all duration-300 hover:shadow-lg hover:brightness-190 active:brightness-95 relative p-2"
                aria-label="Carrinho de compras"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};
