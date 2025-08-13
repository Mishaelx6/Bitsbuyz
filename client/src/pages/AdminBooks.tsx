import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FileUploader } from "@/components/FileUploader";
import type { Book } from "@shared/schema";
import type { UploadResult } from "@uppy/core";
import { Upload, Edit, Trash2, Plus, FileText, Image } from "lucide-react";

export default function AdminBooks() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    coverImageUrl: "",
    pdfUrl: "",
    category: "",
    pageCount: "",
    featured: false,
  });

  const [uploading, setUploading] = useState({
    pdf: false,
    cover: false,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ["/api/books"],
  });

  const createBookMutation = useMutation({
    mutationFn: async (bookData: any) => {
      await apiRequest("POST", "/api/books", bookData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      toast({
        title: "Book Created",
        description: "The book has been successfully added.",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create book.",
        variant: "destructive",
      });
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: async ({ id, ...bookData }: any) => {
      await apiRequest("PUT", `/api/books/${id}`, bookData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      toast({
        title: "Book Updated",
        description: "The book has been successfully updated.",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update book.",
        variant: "destructive",
      });
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/books/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      toast({
        title: "Book Deleted",
        description: "The book has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete book.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      coverImageUrl: "",
      pdfUrl: "",
      category: "",
      pageCount: "",
      featured: false,
    });
    setIsAdding(false);
    setEditingBook(null);
    setUploading({ pdf: false, cover: false });
  };

  // Handle PDF upload
  const handlePDFUpload = async () => {
    const response = await apiRequest("POST", "/api/upload/pdf");
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handlePDFUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadURL = result.successful[0].uploadURL as string;
      setFormData(prev => ({ ...prev, pdfUrl: uploadURL }));
      toast({
        title: "PDF Uploaded",
        description: "PDF file has been successfully uploaded.",
      });
    }
    setUploading(prev => ({ ...prev, pdf: false }));
  };

  // Handle Cover Image upload
  const handleCoverUpload = async () => {
    const response = await apiRequest("POST", "/api/upload/cover");
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleCoverUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadURL = result.successful[0].uploadURL as string;
      setFormData(prev => ({ ...prev, coverImageUrl: uploadURL }));
      toast({
        title: "Cover Image Uploaded",
        description: "Cover image has been successfully uploaded.",
      });
    }
    setUploading(prev => ({ ...prev, cover: false }));
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      description: book.description,
      price: book.price,
      coverImageUrl: book.coverImageUrl,
      pdfUrl: book.pdfUrl || "",
      category: book.category,
      pageCount: book.pageCount?.toString() || "",
      featured: book.featured || false,
    });
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookData = {
      ...formData,
      price: parseFloat(formData.price),
      pageCount: parseInt(formData.pageCount) || 0,
      coverImageUrl: formData.coverImageUrl,
      pdfUrl: formData.pdfUrl,
    };

    if (editingBook) {
      updateBookMutation.mutate({ id: editingBook.id, ...bookData });
    } else {
      createBookMutation.mutate(bookData);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Books</h1>
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700"
          data-testid="add-book-button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Book
        </Button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingBook ? "Edit Book" : "Add New Book"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                data-testid="book-title-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger data-testid="book-category-select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Leadership">Leadership</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Self-Help">Self-Help</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Productivity">Productivity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₦) *
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                data-testid="book-price-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page Count
              </label>
              <Input
                type="number"
                value={formData.pageCount}
                onChange={(e) => setFormData({ ...formData, pageCount: e.target.value })}
                data-testid="book-pagecount-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image *
              </label>
              <div className="space-y-2">
                <FileUploader
                  maxNumberOfFiles={1}
                  maxFileSize={5242880} // 5MB
                  allowedFileTypes={['.jpg', '.jpeg', '.png', '.webp']}
                  onGetUploadParameters={handleCoverUpload}
                  onComplete={handleCoverUploadComplete}
                  buttonClassName="w-full bg-green-600 hover:bg-green-700"
                >
                  <Image className="h-4 w-4 mr-2" />
                  Upload Cover Image
                </FileUploader>
                {formData.coverImageUrl && (
                  <div className="mt-2">
                    <img 
                      src={formData.coverImageUrl} 
                      alt="Cover preview" 
                      className="h-24 w-16 object-cover rounded border"
                    />
                    <p className="text-xs text-gray-500 mt-1">Cover image uploaded</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF File
              </label>
              <div className="space-y-2">
                <FileUploader
                  maxNumberOfFiles={1}
                  maxFileSize={52428800} // 50MB
                  allowedFileTypes={['.pdf']}
                  onGetUploadParameters={handlePDFUpload}
                  onComplete={handlePDFUploadComplete}
                  buttonClassName="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Upload PDF File
                </FileUploader>
                {formData.pdfUrl && (
                  <p className="text-xs text-green-600">✓ PDF file uploaded</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
                data-testid="book-description-input"
              />
            </div>

            <div className="md:col-span-2 flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="mr-2"
                data-testid="book-featured-checkbox"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Featured Book
              </label>
            </div>

            <div className="md:col-span-2 flex gap-4">
              <Button
                type="submit"
                disabled={createBookMutation.isPending || updateBookMutation.isPending}
                data-testid="save-book-button"
              >
                {editingBook ? "Update Book" : "Create Book"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                data-testid="cancel-book-button"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Books List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading books...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PDF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book.id} data-testid={`book-row-${book.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-16 w-12 object-cover rounded"
                          src={book.coverImageUrl}
                          alt={book.title}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{book.title}</div>
                          {book.featured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {book.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₦{book.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {book.pageCount || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {book.pdfUrl ? (
                        <span className="text-green-600">✓ Available</span>
                      ) : (
                        <span className="text-red-600">✗ Missing</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(book)}
                          data-testid={`edit-book-${book.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteBookMutation.mutate(book.id)}
                          className="text-red-600 hover:text-red-700"
                          data-testid={`delete-book-${book.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}