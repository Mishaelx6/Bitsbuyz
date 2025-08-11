import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SimpleHome() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Simple Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Transform Your Mind with
              <span className="block bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                Digital Books & Videos
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed mb-8 max-w-3xl mx-auto">
              Discover thousands of premium digital books and exclusive videos. Download instantly, learn anywhere, anytime.
            </p>

            {/* Simple Stats */}
            <div className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">50+</div>
                <div className="text-gray-300 text-sm">Digital Books</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">25+</div>
                <div className="text-gray-300 text-sm">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">1000+</div>
                <div className="text-gray-300 text-sm">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}