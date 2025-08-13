import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Temporarily using iframe approach to avoid PDF.js compatibility issues
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import type { Book, BookPurchase } from "@shared/schema";
import { ChevronLeft, ChevronRight, BookOpen, Lock, ZoomIn, ZoomOut } from "lucide-react";

// Using iframe to display PDFs - simpler and more compatible approach

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
  const [numPages, setNumPages] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [scale, setScale] = useState(1.0);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get the correct PDF URL - convert Google Drive URLs to embed format for iframe
  const getPDFUrl = (pdfUrl: string) => {
    try {
      // Convert Google Drive URLs to embed format for iframe display
      if (pdfUrl.includes('drive.google.com')) {
        const fileId = pdfUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
        if (fileId) {
          return `https://drive.google.com/file/d/${fileId}/preview`;
        }
      }
      return pdfUrl;
    } catch (error) {
      console.error('Error processing PDF URL:', error);
      return pdfUrl;
    }
  };

  // Get user's reading progress (always enabled now since endpoint works for unauthenticated users)
  const { data: bookPurchase } = useQuery<BookPurchase>({
    queryKey: ["/api/book-purchase", book.id],
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
    if (currentPage >= 4 && !bookPurchase?.hasPaid) {
      setShowPaymentModal(true);
    }
  }, [currentPage, bookPurchase?.hasPaid]);

  // Update progress when page changes
  useEffect(() => {
    if (currentPage > 1) {
      updateProgressMutation.mutate(currentPage);
    }
  }, [currentPage]);

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

  // Add debugging for when component renders
  useEffect(() => {
    console.log('PDFViewer rendered with book:', book.title);
    console.log('Book PDF URL:', book.pdfUrl);
    console.log('Converted PDF URL:', book.pdfUrl ? getPDFUrl(book.pdfUrl) : 'No PDF URL');
  }, [book]);

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
                Page {currentPage} of {numPages || book.pageCount || 1}
                {bookPurchase?.hasPaid && <span className="ml-2 text-green-600">(Full Access)</span>}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} data-testid="close-viewer">
            ✕
          </Button>
        </div>

        {/* PDF Content Area */}
        <div className="relative bg-gray-100 flex items-center justify-center" style={{ height: '70vh' }}>
          {book.pdfUrl ? (
            <div className="w-full h-full flex items-center justify-center overflow-auto">
              {canViewPage(currentPage) ? (
                <div className="flex flex-col items-center">
                  <iframe
                    src={book.pdfUrl ? getPDFUrl(book.pdfUrl) : ''}
                    width="100%"
                    height="100%"
                    style={{ minHeight: '500px' }}
                    title={`${book.title} PDF`}
                    onLoad={() => {
                      console.log('PDF iframe loaded successfully');
                      setNumPages(100); // Set a default page count
                      setPdfError(null);
                    }}
                    onError={() => {
                      console.error('PDF iframe failed to load');
                      setPdfError('Failed to load PDF. Please check the URL.');
                    }}
                    data-testid="pdf-iframe"
                  />
                  
                  {/* Zoom Controls */}
                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                      data-testid="zoom-out"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600 px-2">{Math.round(scale * 100)}%</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setScale(Math.min(2.0, scale + 0.1))}
                      data-testid="zoom-in"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
            disabled={currentPage >= (numPages || book.pageCount || 1)}
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