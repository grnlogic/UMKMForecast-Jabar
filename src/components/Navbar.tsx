import type React from "react";
import { useState } from "react";
import { AboutModal } from "./AboutModal";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=32&width=32"
                  alt="Logo"
                  className="h-7 w-7"
                />
              </div>
              <h1 className="text-xl font-bold tracking-tight">
                UMKMForecast Jabar
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <ul className="flex gap-6">
                <li>
                  <a
                    href="#"
                    className="py-2 px-1 text-white font-medium hover:text-blue-200 border-b-2 border-transparent hover:border-blue-200 transition-all"
                  >
                    Data & Visualisasi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="py-2 px-1 text-white font-medium hover:text-blue-200 border-b-2 border-transparent hover:border-blue-200 transition-all"
                  >
                    Prediksi Pertumbuhan
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAboutModal(true);
                    }}
                    className="py-2 px-1 text-white font-medium hover:text-blue-200 border-b-2 border-transparent hover:border-blue-200 transition-all"
                  >
                    Tentang Aplikasi
                  </a>
                </li>
              </ul>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-white focus:outline-none"
              >
                {isMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-blue-700 py-3 absolute top-full left-0 right-0 bg-blue-900 z-50 shadow-lg">
              <ul className="flex flex-col gap-2 px-4">
                <li>
                  <a
                    href="#"
                    className="block py-2 px-4 text-white hover:bg-blue-800 rounded"
                  >
                    Data & Visualisasi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 px-4 text-white hover:bg-blue-800 rounded"
                  >
                    Prediksi Pertumbuhan
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAboutModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 px-4 text-white hover:bg-blue-800 rounded"
                  >
                    Tentang Aplikasi
                  </a>
                </li>
                <li className="mt-2">
                  <a
                    href="#"
                    className="block py-2 px-4 text-center bg-white text-blue-900 font-medium rounded"
                  >
                    Login
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* About Modal */}
      <AboutModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />
    </>
  );
};
