import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import VideoCard from "@/components/VideoCard";
import CartSidebar from "@/components/CartSidebar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import type { Book, Video, HomepageContent } from "@shared/schema";

export default function Home() {
  const { isCartOpen, toggleCart } = useCart();

  const { data: homepageContent } = useQuery<HomepageContent>({
    queryKey: ["/api/homepage"],
  });

  const { data: featuredBooks = [] } = useQuery<Book[]>({
    queryKey: ["/api/books", { featured: true }],
  });

  const { data: featuredVideos = [] } = useQuery<Video[]>({
    queryKey: ["/api/videos", { featured: true }],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="pt-16 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
                {homepageContent?.heroTitle || "Transforming Leadership Through"} 
                <span className="text-accent block">Authentic Storytelling</span>
              </h1>
              <blockquote className="text-xl sm:text-2xl font-georgia italic text-secondary mb-8 pl-4 border-l-4 border-accent">
                {homepageContent?.tagline || '"The stories we tell ourselves shape the leaders we become."'}
              </blockquote>
              <p className="text-lg text-secondary mb-8 leading-relaxed">
                {homepageContent?.biography || "Bestselling author of 5 transformational leadership books, keynote speaker for Fortune 500 companies, and thought leader helping executives unlock their authentic leadership potential through the power of narrative."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-accent text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  onClick={() => window.location.href = '/books'}
                >
                  Explore My Books
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-accent text-accent px-8 py-4 rounded-lg font-semibold hover:bg-accent hover:text-white transition-colors duration-200"
                  onClick={() => window.location.href = '/videos'}
                >
                  Watch Latest Talk
                </Button>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <img 
                src={homepageContent?.profileImageUrl || "https://images.unsplash.com/photo-1494790108755-2616b612b1c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500"}
                alt="Dr. Sarah Johnson - Professional headshot" 
                className="w-80 h-80 lg:w-96 lg:h-96 rounded-2xl shadow-2xl object-cover border-4 border-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What I Do Section */}
      <section id="about" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">What I Do</h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              I help leaders and organizations unlock their full potential through three core pillars of transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Speaking */}
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-microphone text-2xl text-accent"></i>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Keynote Speaking</h3>
              <p className="text-secondary mb-6 leading-relaxed">
                Inspiring talks for corporate events, conferences, and leadership summits. Over 200 keynotes delivered worldwide to audiences of 50-5000.
              </p>
            </div>

            {/* Writing */}
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-pen-fancy text-2xl text-accent"></i>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Bestselling Author</h3>
              <p className="text-secondary mb-6 leading-relaxed">
                Five bestselling books on leadership, including "The Narrative Leader" which topped business charts for 12 weeks and sold over 100,000 copies.
              </p>
            </div>

            {/* Coaching */}
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-users text-2xl text-accent"></i>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Executive Coaching</h3>
              <p className="text-secondary mb-6 leading-relaxed">
                One-on-one and group coaching for C-suite executives and emerging leaders. Certified by ICF with over 1000 coaching hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section id="books" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Featured Books</h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Discover transformational insights through my bestselling collection of leadership and personal development books.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredBooks.slice(0, 4).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="bg-white border-2 border-accent text-accent px-8 py-4 rounded-lg font-semibold hover:bg-accent hover:text-white transition-colors duration-200"
              onClick={() => window.location.href = '/books'}
            >
              View All Books
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Videos Section */}
      <section id="videos" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Latest Videos</h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Watch my latest keynotes, interviews, and thought leadership discussions on platforms worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {featuredVideos.slice(0, 3).map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="bg-white border-2 border-accent text-accent px-8 py-4 rounded-lg font-semibold hover:bg-accent hover:text-white transition-colors duration-200"
              onClick={() => window.location.href = '/videos'}
            >
              View All Videos
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 lg:py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Let's Transform Your Leadership Journey</h2>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Ready to unlock your authentic leadership potential? Whether you're looking for keynote speaking, executive coaching, or organizational transformation, let's start a conversation about your goals.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <i className="fas fa-envelope text-white"></i>
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-blue-100">sarah@sarahjohnsonleadership.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <i className="fas fa-phone text-white"></i>
                  </div>
                  <div>
                    <p className="font-semibold">Speaking Inquiries</p>
                    <p className="text-blue-100">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a href="#" className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200">
                  <i className="fab fa-youtube text-xl"></i>
                </a>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input type="text" className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-accent focus:border-transparent" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-accent focus:border-transparent" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-accent focus:border-transparent" placeholder="john@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea rows={4} className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-accent focus:border-transparent" placeholder="Tell me about your event, goals, or how I can help..."></textarea>
                </div>
                <Button type="submit" className="w-full bg-accent text-white py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <CartSidebar />
    </div>
  );
}
