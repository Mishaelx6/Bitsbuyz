import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
              Digital Learning Platform
              <span className="text-accent block">Seamless Online Shopping Experience</span>
            </h1>
            <p className="text-xl text-secondary mb-8 max-w-4xl mx-auto leading-relaxed">
              BitsBuyz is a Nigerian based e-commerce startup built to deliver seamless, mobile-first online shopping Experience. 
              BitsBuyz aim to capture a significant share in Nigeria growing e-commerce market projected to reach USD 33 Billion by 2026 
              while expanding globally through strategic partnership and innovative marketing.
            </p>
            
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">50+</div>
                <div className="text-secondary">Digital Books</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">25+</div>
                <div className="text-secondary">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">1000+</div>
                <div className="text-secondary">Happy Customers</div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-2xl mb-2">📚</div>
                <h3 className="font-semibold mb-2">Browse Digital Books</h3>
                <p className="text-sm text-secondary">Explore our extensive collection of digital books</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-2xl mb-2">🎥</div>
                <h3 className="font-semibold mb-2">Watch Videos</h3>
                <p className="text-sm text-secondary">Access educational and entertainment videos</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold mb-2">Instant Download</h3>
                <p className="text-sm text-secondary">Get your content immediately after purchase</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-2xl mb-2">🕒</div>
                <h3 className="font-semibold mb-2">24/7 Access</h3>
                <p className="text-sm text-secondary">Access your content anytime, anywhere</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="text-2xl mb-2">⭐</div>
                <h3 className="font-semibold mb-2">Premium Quality</h3>
                <p className="text-sm text-secondary">High-quality digital content and service</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-accent text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                onClick={() => window.location.href = '/api/login'}
              >
                Admin Login
              </Button>
              <Button
                variant="outline"
                className="border-2 border-accent text-accent px-8 py-4 rounded-lg font-semibold hover:bg-accent hover:text-white transition-colors duration-200"
                onClick={() => window.location.href = '/books'}
              >
                Explore Books
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
