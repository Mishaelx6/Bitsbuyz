import { useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Cart() {
  const { cartItems, removeFromCart, total, isLoading } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const removeItemMutation = useMutation({
    mutationFn: async (bookId: string) => {
      await apiRequest("DELETE", `/api/cart/${bookId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "The book has been removed from your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear cart.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-primary mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-500 mb-2">Your cart is empty</h3>
              <p className="text-gray-400 mb-6">Add some books to get started</p>
              <Button
                onClick={() => window.location.href = '/books'}
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Browse Books
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.book.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex gap-6">
                    <img
                      src={item.book.coverImageUrl}
                      alt={item.book.title}
                      className="w-24 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary mb-2">{item.book.title}</h3>
                      <p className="text-secondary mb-4 line-clamp-2">{item.book.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-accent">₦{item.book.price}</span>
                          <span className="text-sm text-secondary">Quantity: {item.quantity}</span>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeItemMutation.mutate(item.book.id)}
                          disabled={removeItemMutation.isPending}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-2xl font-bold text-primary">Total: ₦{total.toFixed(2)}</span>
                  <Button
                    variant="outline"
                    onClick={() => clearCartMutation.mutate()}
                    disabled={clearCartMutation.isPending}
                  >
                    Clear Cart
                  </Button>
                </div>
                <div className="flex gap-4">
                  <Button
                    className="flex-1 bg-accent text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    onClick={() => window.location.href = '/checkout'}
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/books'}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
