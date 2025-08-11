import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import VideoCard from "@/components/VideoCard";
import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, BookOpen, Video, ShoppingCart, User, Calendar, Clock, PlayCircle, ArrowRight, Zap, Download, Globe, TrendingUp, Users, Award } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/hooks/useCart";
import type { Book, Video as VideoType, HomepageContent } from "@shared/schema";

// Background images for the hero section
const backgroundImages = [
  // E-commerce and digital books theme
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', // Books on desk
  // Online learning and videos theme  
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', // People learning online
  // Digital commerce theme
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', // Online shopping setup
  // Reading and education theme
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', // Reading books
  // Digital content creation theme
  'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', // Content creation setup
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isCartOpen, toggleCart } = useCart();

  const { data: homepageContent } = useQuery<HomepageContent>({
    queryKey: ["/api/homepage"],
  });

  const { data: featuredBooks = [] } = useQuery<Book[]>({
    queryKey: ["/api/books"],
  });

  const { data: featuredVideos = [] } = useQuery<VideoType[]>({
    queryKey: ["/api/videos"],
  });

  // Auto-change background images with smooth transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Get featured items
  const displayBooks = featuredBooks.filter(book => book.featured).slice(0, 3);
  const displayVideos = featuredVideos.filter(video => video.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section with Background Images */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images with Smooth Transition */}
        <div className="absolute inset-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            
            {/* Main Headline */}
            <div className="mb-8">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4 mr-2" />
                Digital Learning Platform
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                {homepageContent?.heroTitle || "Transform Your Mind with"}
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Digital Books & Videos
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed mb-8 max-w-3xl mx-auto">
                {homepageContent?.biography || "Discover thousands of premium digital books and exclusive video courses. Download instantly, learn anywhere, anytime."}
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">50+</div>
                <div className="text-gray-300 text-sm">Digital Books</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">25+</div>
                <div className="text-gray-300 text-sm">Video Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">1000+</div>
                <div className="text-gray-300 text-sm">Happy Customers</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/books">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Browse Digital Books
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              
              <Link href="/videos">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold backdrop-blur-sm bg-white/10">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Watch Video Courses
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-300">
              <div className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Instant Download</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>24/7 Access</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Premium Quality</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
            <span className="text-sm">Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Experience the future of digital learning with our comprehensive collection of books and video courses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Instant Access</h3>
              <p className="text-gray-600">Download your purchases immediately. No waiting, no shipping delays.</p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Expert Authors</h3>
              <p className="text-gray-600">Learn from industry leaders and renowned experts in their fields.</p>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Regular Updates</h3>
              <p className="text-gray-600">Fresh content added regularly to keep your learning up-to-date.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      {displayBooks.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Books</h2>
                <p className="text-xl text-gray-600">Handpicked bestsellers and must-reads</p>
              </div>
              <Link href="/books">
                <Button variant="outline" className="flex items-center space-x-2">
                  <span>View All Books</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Videos Section */}
      {displayVideos.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Video Courses</h2>
                <p className="text-xl text-gray-600">Learn from expert-led video content</p>
              </div>
              <Link href="/videos">
                <Button variant="outline" className="flex items-center space-x-2">
                  <span>View All Videos</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-xl text-blue-100 mb-8">Get notified when new books and courses are available</p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 font-semibold">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <CartSidebar isOpen={isCartOpen} onClose={toggleCart} />
    </div>
  );
}