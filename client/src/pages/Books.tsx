import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";
import PDFViewer from "@/components/PDFViewer";
import SearchFilters from "@/components/SearchFilters";
import CartSidebar from "@/components/CartSidebar";
import type { Book } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function Books() {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ["/api/books", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "all-all") {
          if (key === 'minPrice' && value === 'all') return;
          if (key === 'maxPrice' && value === 'all') return;
          params.append(key, value);
        }
      });
      
      const response = await fetch(`/api/books?${params}`);
      if (!response.ok) throw new Error('Failed to fetch books');
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Book Library</h1>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Explore our complete collection of leadership and personal development books.
            </p>
          </div>

          <SearchFilters
            filters={filters}
            onFiltersChange={setFilters}
            type="books"
          />

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg animate-pulse">
                  <div className="w-full h-64 bg-gray-200 rounded-t-2xl"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {books.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onReadBook={setSelectedBook}
                />
              ))}
            </div>
          )}

          {!isLoading && books.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-book text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No books found</h3>
              <p className="text-gray-400">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <CartSidebar />
      
      {/* PDF Viewer Modal */}
      {selectedBook && (
        <PDFViewer 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
        />
      )}
    </div>
  );
}
