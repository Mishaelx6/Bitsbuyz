import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Clock, Store, Bell, Gift } from "lucide-react";

export default function StoreComingSoon() {
  useEffect(() => {
    document.title = "Store Coming Soon - bitsbuyz";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Main heading */}
            <div className="mb-8">
              <Store className="h-24 w-24 mx-auto text-blue-600 mb-6" />
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                BitsBuyz Store
              </h1>
              <h2 className="text-3xl font-semibold text-blue-600 mb-6">
                Coming Soon!
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                We're building something amazing! Our comprehensive digital marketplace featuring 
                African-themed books, videos, and exclusive content will be launching soon.
              </p>
            </div>

            {/* Features preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Exclusive Content</h3>
                <p className="text-gray-600">Premium African-themed digital books and video content</p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Access</h3>
                <p className="text-gray-600">Download and stream content immediately after purchase</p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h3>
                <p className="text-gray-600">Be the first to know when we launch</p>
              </Card>
            </div>

            {/* Newsletter signup */}
            <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-bold mb-4">Get Notified When We Launch</h3>
                <p className="mb-6 text-blue-100">
                  Be among the first to access our exclusive African-themed digital content marketplace.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input 
                    type="email" 
                    placeholder="Enter your email address"
                    className="flex-1 bg-white text-gray-900 border-0"
                  />
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6">
                    Notify Me
                  </Button>
                </div>
                
                <p className="text-xs text-blue-200 mt-4">
                  We'll only send you updates about our launch. No spam, promise!
                </p>
              </div>
            </Card>

            {/* Back to homepage */}
            <div className="mt-12">
              <p className="text-gray-600 mb-4">
                In the meantime, explore our current collection of books and videos
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline" 
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  onClick={() => window.location.href = '/books'}
                >
                  Browse Books
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                  onClick={() => window.location.href = '/videos'}
                >
                  Watch Videos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}