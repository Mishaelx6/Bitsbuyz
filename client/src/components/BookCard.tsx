import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Book } from "@shared/schema";

interface BookCardProps {
  book: Book;
  onReadBook?: (book: Book) => void;
}

export default function BookCard({ book, onReadBook }: BookCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cart", { bookId: book.id, quantity: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `"${book.title}" has been added to your cart.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add book to cart.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <img 
        src={book.coverImageUrl}
        alt={`${book.title} book cover`}
        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          console.error('Image load error for book:', book.title);
          console.error('Image URL:', book.coverImageUrl);
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600/f3f4f6/9ca3af?text=Cover+Not+Available';
        }}
      />
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary mb-2">{book.title}</h3>
        <p className="text-secondary text-sm mb-4 line-clamp-3">{book.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-accent">₦{book.price}</span>
          {book.rating && book.reviewCount && (
            <div className="flex items-center gap-1">
              <i className="fas fa-star text-yellow-400"></i>
              <span className="text-sm text-secondary">{book.rating} ({book.reviewCount})</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Button 
            className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
            onClick={() => addToCartMutation.mutate()}
            disabled={addToCartMutation.isPending}
          >
            {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
          </Button>
          {book.pdfUrl && onReadBook && (
            <Button 
              variant="outline"
              className="w-full border border-gray-200 text-secondary py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
              onClick={() => onReadBook(book)}
              data-testid={`read-book-${book.id}`}
            >
              Read Book
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
