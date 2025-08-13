import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import type { Book, BookPurchase } from "@shared/schema";
import { ChevronLeft, ChevronRight, BookOpen, Lock } from "lucide-react";

interface PDFViewerProps {
  book: Book;
  onClose: () => void;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function PDFViewer({ book, onClose }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get the correct PDF URL for our storage system
  const getPDFUrl = (pdfUrl: string) => {
    if (pdfUrl.startsWith('https://storage.googleapis.com/')) {
      // Extract file ID from storage URL and serve through our protected endpoint
      const url = new URL(pdfUrl);
      const pathParts = url.pathname.split('/');
      const fileId = pathParts[pathParts.length - 1];
      return `/pdfs/${fileId}`;
    }
    return pdfUrl;
  };

  // Get user's reading progress
  const { data: bookPurchase } = useQuery<BookPurchase>({
    queryKey: ["/api/book-purchase", book.id],
    enabled: !!user,
  });

  // Update reading progress
  const updateProgressMutation = useMutation({
    mutationFn: async (page: number) => {
      await apiRequest("PUT", "/api/book-purchase/progress", {
        bookId: book.id,
        currentPage: page,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/book-purchase", book.id] });
    },
  });

  // Initialize current page from user's progress
  useEffect(() => {
    if (bookPurchase?.currentPage) {
      setCurrentPage(bookPurchase.currentPage);
    }
  }, [bookPurchase]);

  // Check if user needs to pay when reaching page 4
  useEffect(() => {
    if (currentPage >= 4 && !bookPurchase?.hasPaid && user) {
      setShowPaymentModal(true);
    }
  }, [currentPage, bookPurchase?.hasPaid, user]);

  // Update progress when page changes
  useEffect(() => {
    if (user && currentPage > 1) {
      updateProgressMutation.mutate(currentPage);
    }
  }, [currentPage, user]);

  const canViewPage = (page: number) => {
    if (!user) return page <= 3; // Anonymous users can only see first 3 pages
    if (bookPurchase?.hasPaid) return true; // Paid users can see all pages
    return page <= 3; // Unpaid users can only see first 3 pages
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > (book.pageCount || 1)) return;
    
    if (!canViewPage(newPage)) {
      setShowPaymentModal(true);
      return;
    }
    
    setCurrentPage(newPage);
  };

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to purchase this book.",
        variant: "destructive",
      });
      return;
    }

    setIsPaymentLoading(true);

    try {
      // Initialize payment with Paystack
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: (user as any).email || (user as any).username,
        amount: parseFloat(book.price) * 100, // Convert to kobo
        currency: 'NGN',
        ref: `book_${book.id}_${Date.now()}`,
        metadata: {
          bookId: book.id,
          userId: (user as any).id,
          bookTitle: book.title,
        },
        callback: async function(response: any) {
          try {
            // Verify payment on server
            await apiRequest("POST", "/api/verify-book-payment", {
              reference: response.reference,
              bookId: book.id,
            });

            toast({
              title: "Payment Successful!",
              description: "You now have full access to this book.",
            });

            setShowPaymentModal(false);
            queryClient.invalidateQueries({ queryKey: ["/api/book-purchase", book.id] });
          } catch (error) {
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if payment was deducted.",
              variant: "destructive",
            });
          }
        },
        onClose: function() {
          setIsPaymentLoading(false);
        }
      });

      handler.openIframe();
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      setIsPaymentLoading(false);
    }
  };

  // Load Paystack script
  useEffect(() => {
    if (!window.PaystackPop) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" data-testid="pdf-viewer-modal">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900" data-testid="book-title">{book.title}</h2>
              <p className="text-sm text-gray-600">
                Page {currentPage} of {book.pageCount || 1}
                {bookPurchase?.hasPaid && <span className="ml-2 text-green-600">(Full Access)</span>}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} data-testid="close-viewer">
            ✕
          </Button>
        </div>

        {/* PDF Content Area */}
        <div className="relative h-96 bg-gray-100 flex items-center justify-center">
          {book.pdfUrl ? (
            <div className="w-full h-full flex items-center justify-center">
              {canViewPage(currentPage) ? (
                <iframe
                  src={`${getPDFUrl(book.pdfUrl)}#page=${currentPage}`}
                  className="w-full h-full border-0"
                  title={`${book.title} - Page ${currentPage}`}
                  data-testid="pdf-iframe"
                />
              ) : (
                <div className="text-center p-8">
                  <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Premium Content</h3>
                  <p className="text-gray-600 mb-4">
                    Purchase this book to continue reading beyond page 3
                  </p>
                  <p className="text-2xl font-bold text-blue-600 mb-4">₦{book.price}</p>
                  <Button onClick={() => setShowPaymentModal(true)} data-testid="unlock-book">
                    Unlock Full Book
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-600">PDF not available for this book</p>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            data-testid="prev-page"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-gray-600">
            {!canViewPage(currentPage + 1) && !bookPurchase?.hasPaid && (
              <span className="text-orange-600 font-medium">
                Preview Mode - Purchase to continue
              </span>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= (book.pageCount || 1)}
            data-testid="next-page"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Purchase Book</h3>
            <p className="text-gray-600 mb-4">
              To continue reading "{book.title}", please complete your purchase.
            </p>
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-blue-600">₦{book.price}</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1"
                data-testid="cancel-payment"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isPaymentLoading}
                className="flex-1"
                data-testid="proceed-payment"
              >
                {isPaymentLoading ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}