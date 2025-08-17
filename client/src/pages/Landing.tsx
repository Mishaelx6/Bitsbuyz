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
              Welcome to
              <span className="text-accent block">Bitsbuyz Stores</span>
            </h1>
            <p className="text-xl text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
              Your trusted destination for quality products and exceptional service. 
              Discover a wide range of products to meet your needs.
            </p>
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
