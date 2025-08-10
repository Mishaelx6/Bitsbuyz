import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Book } from "@shared/schema";

interface CartItem {
  book: Book;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  total: number;
  isCartOpen: boolean;
  isLoading: boolean;
  toggleCart: () => void;
  removeFromCart: (bookId: string) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { data: cartData = [], isLoading } = useQuery({
    queryKey: ["/api/cart"],
    queryFn: async () => {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Failed to fetch cart");
      const cartItems = await response.json();
      
      const cartWithBooks: CartItem[] = [];
      for (const item of cartItems) {
        const bookResponse = await fetch(`/api/books/${item.bookId}`);
        if (bookResponse.ok) {
          const book = await bookResponse.json();
          cartWithBooks.push({ book, quantity: item.quantity });
        }
      }
      return cartWithBooks;
    },
    refetchInterval: false,
  });

  const cartItems = cartData as CartItem[];
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.book.price) * item.quantity), 0);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  
  const removeFromCart = async (bookId: string) => {
    try {
      await fetch(`/api/cart/${bookId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      total,
      isCartOpen,
      isLoading,
      toggleCart,
      removeFromCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}