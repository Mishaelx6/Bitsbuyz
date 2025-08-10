import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, toggleCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-xl font-bold text-primary cursor-pointer">Dr. Sarah Johnson</h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/">
                <a className={`text-secondary hover:text-accent transition-colors duration-200 font-medium ${location === '/' ? 'text-accent' : ''}`}>
                  Home
                </a>
              </Link>
              <Link href="/books">
                <a className={`text-secondary hover:text-accent transition-colors duration-200 font-medium ${location === '/books' ? 'text-accent' : ''}`}>
                  Books
                </a>
              </Link>
              <Link href="/videos">
                <a className={`text-secondary hover:text-accent transition-colors duration-200 font-medium ${location === '/videos' ? 'text-accent' : ''}`}>
                  Videos
                </a>
              </Link>
              {isAuthenticated && (
                <Link href="/admin">
                  <a className={`text-secondary hover:text-accent transition-colors duration-200 font-medium ${location === '/admin' ? 'text-accent' : ''}`}>
                    Admin
                  </a>
                </Link>
              )}
              <button 
                className="relative p-2 text-secondary hover:text-accent transition-colors duration-200"
                onClick={toggleCart}
              >
                <i className="fas fa-shopping-cart text-lg"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary hover:text-accent focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className="fas fa-bars text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
            <Link href="/">
              <a 
                className="block px-3 py-2 text-secondary hover:text-accent transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
            </Link>
            <Link href="/books">
              <a 
                className="block px-3 py-2 text-secondary hover:text-accent transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Books
              </a>
            </Link>
            <Link href="/videos">
              <a 
                className="block px-3 py-2 text-secondary hover:text-accent transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Videos
              </a>
            </Link>
            {isAuthenticated && (
              <Link href="/admin">
                <a 
                  className="block px-3 py-2 text-secondary hover:text-accent transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </a>
              </Link>
            )}
            <button 
              className="w-full text-left px-3 py-2 text-secondary hover:text-accent transition-colors duration-200"
              onClick={() => {
                toggleCart();
                setIsMobileMenuOpen(false);
              }}
            >
              Cart ({cartCount})
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
