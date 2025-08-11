import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import type { SiteContent } from "@shared/schema";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, toggleCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();

  const { data: siteContent } = useQuery<SiteContent>({
    queryKey: ["/api/site-content"],
  });

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-lg font-bold text-lg tracking-wide">
                  {siteContent?.logoText || "bitsbuyz"}
                </div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className={`text-secondary hover:text-accent transition-colors duration-200 font-medium ${location === '/' ? 'text-accent' : ''}`}>
                Home
              </Link>
              <Link href="/books" className={`text-secondary hover:text-accent transition-colors duration-200 font-medium ${location === '/books' ? 'text-accent' : ''}`}>
                Books
              </Link>
              <Link href="/videos" className={`text-secondary hover:text-accent transition-colors duration-200 font-medium ${location === '/videos' ? 'text-accent' : ''}`}>
                Videos
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/admin" className={`text-secondary hover:text-accent transition-colors duration-200 font-medium ${location === '/admin' ? 'text-accent' : ''}`}>
                    Admin
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        await fetch('/api/logout', { method: 'POST' });
                        window.location.reload();
                      } catch (error) {
                        console.error('Logout failed:', error);
                      }
                    }}
                    className="text-secondary hover:text-accent transition-colors duration-200 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  href="/auth"
                  className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                >
                  Login
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
            <Link 
              href="/"
              className="block px-3 py-2 text-secondary hover:text-accent transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/books"
              className="block px-3 py-2 text-secondary hover:text-accent transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Books
            </Link>
            <Link 
              href="/videos"
              className="block px-3 py-2 text-secondary hover:text-accent transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Videos
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  href="/admin"
                  className="block px-3 py-2 text-secondary hover:text-accent transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
                <button
                  onClick={async () => {
                    try {
                      await fetch('/api/logout', { method: 'POST' });
                      setIsMobileMenuOpen(false);
                      window.location.reload();
                    } catch (error) {
                      console.error('Logout failed:', error);
                    }
                  }}
                  className="block px-3 py-2 text-secondary hover:text-accent transition-colors duration-200 w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/auth"
                className="block px-3 py-2 bg-accent text-white rounded-lg text-center mx-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
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
