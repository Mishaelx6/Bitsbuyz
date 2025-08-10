import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Checkout() {
  const [email, setEmail] = useState("");
  const { cartItems, total } = useCart();
  const { toast } = useToast();

  const checkoutMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/checkout", { email });
      return response.json();
    },
    onSuccess: (data) => {
      // Redirect to Paystack payment page
      window.location.href = data.authorizationUrl;
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process checkout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please provide your email address.",
        variant: "destructive",
      });
      return;
    }
    checkoutMutation.mutate(email);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-primary mb-4">Checkout</h1>
              <p className="text-xl text-secondary mb-8">Your cart is empty</p>
              <Button
                onClick={() => window.location.href = '/books'}
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Browse Books
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-primary mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-primary mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.book.id} className="flex gap-4">
                    <img
                      src={item.book.coverImageUrl}
                      alt={item.book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary">{item.book.title}</h3>
                      <p className="text-sm text-secondary">Qty: {item.quantity}</p>
                      <p className="font-bold text-accent">${item.book.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-2xl font-bold text-primary">
                  <span>Total:</span>
                  <span className="text-accent">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-primary mb-6">Payment Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                  <p className="text-sm text-secondary mt-1">
                    You'll receive your book downloads and receipt at this email.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-primary mb-2">Secure Payment</h3>
                  <p className="text-sm text-secondary">
                    Your payment is processed securely through Paystack. After completing your payment, 
                    you'll receive immediate access to download your books.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={checkoutMutation.isPending}
                  className="w-full bg-accent text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
                >
                  {checkoutMutation.isPending ? "Processing..." : `Pay $${total.toFixed(2)}`}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By clicking "Pay", you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
