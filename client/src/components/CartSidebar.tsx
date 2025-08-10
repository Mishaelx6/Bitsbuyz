import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function CartSidebar() {
  const { isCartOpen, toggleCart, cartItems, total } = useCart();
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

  return (
    <>
      {/* Cart Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-primary">Shopping Cart</h3>
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              onClick={toggleCart}
            >
              <i className="fas fa-times text-lg text-secondary"></i>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.book.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                    <img 
                      src={item.book.coverImageUrl}
                      alt="Book cover" 
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary mb-1">{item.book.title}</h4>
                      <p className="text-accent font-bold">${item.book.price}</p>
                      <p className="text-sm text-secondary">Qty: {item.quantity}</p>
                      <button 
                        className="text-red-500 text-sm hover:text-red-600 mt-2"
                        onClick={() => removeItemMutation.mutate(item.book.id)}
                        disabled={removeItemMutation.isPending}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-primary">Total:</span>
                <span className="text-2xl font-bold text-accent">${total.toFixed(2)}</span>
              </div>
              <Button 
                className="w-full bg-accent text-white py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-lg mb-3"
                onClick={() => {
                  toggleCart();
                  window.location.href = '/checkout';
                }}
              >
                Proceed to Checkout
              </Button>
              <Button 
                variant="outline"
                className="w-full border border-gray-300 text-secondary py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
                onClick={toggleCart}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Cart Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleCart}
      />
    </>
  );
}
