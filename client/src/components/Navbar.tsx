import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Menu, X, ShoppingCart, Search, User, BookOpen, Video, Star, Heart, Bell } from "lucide-react";
import type { SiteContent } from "@shared/schema";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount, toggleCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();

  const { data: siteContent } = useQuery<SiteContent>({
    queryKey: ["/api/site-content"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to books page with search query
      // TODO: Implement search functionality
      console.log("Search:", searchQuery);
    }
  };

  return (
    <>
      {/* Main navigation */}
      <nav className="sticky top-0 bg-white shadow-lg border-b border-gray-200 z-50">
        <div className="container mx-auto px-4">
          {/* Top row with logo, search, and actions */}
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="flex items-center space-x-3 cursor-pointer group">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl font-bold text-xl tracking-wide group-hover:shadow-lg transition-all duration-200">
                    {siteContent?.logoText || "bitsbuyz"}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Digital Store</div>
                    <div className="text-sm text-gray-700 font-medium">Books & Videos</div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Search bar - hidden on mobile */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search books, videos, topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border-2 border-gray-200 rounded-full focus:border-blue-500 focus:ring-0"
                  />
                  <Button 
                    type="submit"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              
              {/* Search icon for mobile */}
              <button className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Search className="h-5 w-5" />
              </button>

              {/* User account */}
              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-2">
                  <div className="relative group">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:bg-gray-100">
                      <User className="h-4 w-4" />
                      <span className="hidden lg:inline">Account</span>
                    </Button>
                    
                    {/* Dropdown menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-2">
                        <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <span className="flex items-center space-x-2">
                            <Star className="h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </span>
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
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/auth">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <User className="h-4 w-4 mr-1" />
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Wishlist (placeholder) */}
              <button className="hidden md:block p-2 text-gray-600 hover:text-red-500 transition-colors relative">
                <Heart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </button>

              {/* Shopping cart */}
              <button 
                onClick={toggleCart}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors group"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
                <span className="hidden lg:block text-xs text-gray-500 mt-1">Cart</span>
              </button>

              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Navigation categories - hidden on mobile */}
          <div className="hidden md:flex items-center justify-center space-x-8 pb-4 border-t border-gray-100 pt-4">
            <Link 
              href="/" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location === '/' 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <span>🏠</span>
              <span>Home</span>
            </Link>
            
            <Link 
              href="/books" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location === '/books' 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Digital Books</span>
            </Link>
            
            <Link 
              href="/videos" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location === '/videos' 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Video className="h-4 w-4" />
              <span>Videos</span>
            </Link>

            {/* Category filters */}
            <div className="text-gray-400">|</div>
            
            <button className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Leadership
            </button>
            <button className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Business
            </button>
            <button className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Self-Help
            </button>
            <button className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Bestsellers
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-6 space-y-4">
              
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="relative mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border-2 border-gray-200 rounded-full"
                  />
                </div>
              </form>

              {/* Mobile navigation links */}
              <div className="space-y-3">
                <Link 
                  href="/"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>🏠</span>
                  <span className="font-medium">Home</span>
                </Link>
                
                <Link 
                  href="/books"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BookOpen className="h-5 w-5" />
                  <span className="font-medium">Digital Books</span>
                </Link>
                
                <Link 
                  href="/videos"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Video className="h-5 w-5" />
                  <span className="font-medium">Videos</span>
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link 
                      href="/admin"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Star className="h-5 w-5" />
                      <span className="font-medium">Admin Dashboard</span>
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
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    href="/auth"
                    className="flex items-center justify-center space-x-2 mx-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Sign In</span>
                  </Link>
                )}

                <button 
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
                  onClick={() => {
                    toggleCart();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-medium">Shopping Cart ({cartCount})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}