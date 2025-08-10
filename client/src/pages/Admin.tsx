import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import type { Book, Video, HomepageContent } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: books = [] } = useQuery<Book[]>({
    queryKey: ["/api/books"],
    enabled: isAuthenticated,
  });

  const { data: videos = [] } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
    enabled: isAuthenticated,
  });

  const { data: homepageContent } = useQuery<HomepageContent>({
    queryKey: ["/api/homepage"],
    enabled: isAuthenticated,
  });

  // Book form state
  const [bookForm, setBookForm] = useState({
    title: "",
    description: "",
    price: "",
    coverImageUrl: "",
    pdfUrl: "",
    category: "",
    featured: false,
  });

  // Video form state
  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    videoUrl: "",
    platform: "",
    duration: "",
    featured: false,
  });

  // Homepage form state
  const [homepageForm, setHomepageForm] = useState({
    profileImageUrl: "",
    tagline: "",
    biography: "",
    heroTitle: "",
    heroSubtitle: "",
    whatIDoTitle: "",
    whatIDoDescription: "",
  });

  // Update homepage form when data loads
  useEffect(() => {
    if (homepageContent) {
      setHomepageForm({
        profileImageUrl: homepageContent.profileImageUrl || "",
        tagline: homepageContent.tagline || "",
        biography: homepageContent.biography || "",
        heroTitle: homepageContent.heroTitle || "",
        heroSubtitle: homepageContent.heroSubtitle || "",
        whatIDoTitle: homepageContent.whatIDoTitle || "",
        whatIDoDescription: homepageContent.whatIDoDescription || "",
      });
    }
  }, [homepageContent]);

  // Book mutations
  const createBookMutation = useMutation({
    mutationFn: async (book: any) => {
      await apiRequest("POST", "/api/books", book);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      setBookForm({
        title: "",
        description: "",
        price: "",
        coverImageUrl: "",
        pdfUrl: "",
        category: "",
        featured: false,
      });
      toast({ title: "Success", description: "Book created successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({ title: "Error", description: "Failed to create book", variant: "destructive" });
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/books/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      toast({ title: "Success", description: "Book deleted successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({ title: "Error", description: "Failed to delete book", variant: "destructive" });
    },
  });

  // Video mutations
  const createVideoMutation = useMutation({
    mutationFn: async (video: any) => {
      await apiRequest("POST", "/api/videos", video);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      setVideoForm({
        title: "",
        description: "",
        thumbnailUrl: "",
        videoUrl: "",
        platform: "",
        duration: "",
        featured: false,
      });
      toast({ title: "Success", description: "Video created successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({ title: "Error", description: "Failed to create video", variant: "destructive" });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/videos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({ title: "Success", description: "Video deleted successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({ title: "Error", description: "Failed to delete video", variant: "destructive" });
    },
  });

  // Homepage content mutation
  const updateHomepageMutation = useMutation({
    mutationFn: async (content: any) => {
      await apiRequest("PUT", "/api/homepage", content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/homepage"] });
      toast({ title: "Success", description: "Homepage updated successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({ title: "Error", description: "Failed to update homepage", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-primary">Admin Dashboard</h1>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/api/logout'}
            >
              Logout
            </Button>
          </div>

          <Tabs defaultValue="homepage" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="homepage">Homepage</TabsTrigger>
              <TabsTrigger value="books">Books</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            {/* Homepage Content Tab */}
            <TabsContent value="homepage">
              <Card>
                <CardHeader>
                  <CardTitle>Homepage Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    updateHomepageMutation.mutate(homepageForm);
                  }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="heroTitle">Hero Title</Label>
                        <Input
                          id="heroTitle"
                          value={homepageForm.heroTitle}
                          onChange={(e) => setHomepageForm(prev => ({ ...prev, heroTitle: e.target.value }))}
                          placeholder="Transforming Leadership Through"
                        />
                      </div>
                      <div>
                        <Label htmlFor="profileImageUrl">Profile Image URL</Label>
                        <Input
                          id="profileImageUrl"
                          value={homepageForm.profileImageUrl}
                          onChange={(e) => setHomepageForm(prev => ({ ...prev, profileImageUrl: e.target.value }))}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input
                        id="tagline"
                        value={homepageForm.tagline}
                        onChange={(e) => setHomepageForm(prev => ({ ...prev, tagline: e.target.value }))}
                        placeholder="The stories we tell ourselves shape the leaders we become."
                      />
                    </div>

                    <div>
                      <Label htmlFor="biography">Biography</Label>
                      <Textarea
                        id="biography"
                        value={homepageForm.biography}
                        onChange={(e) => setHomepageForm(prev => ({ ...prev, biography: e.target.value }))}
                        placeholder="Bestselling author of 5 transformational leadership books..."
                        rows={4}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={updateHomepageMutation.isPending}
                      className="bg-accent text-white hover:bg-blue-600"
                    >
                      {updateHomepageMutation.isPending ? "Updating..." : "Update Homepage"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Books Tab */}
            <TabsContent value="books" className="space-y-8">
              {/* Add Book Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Book</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    createBookMutation.mutate({
                      ...bookForm,
                      price: parseFloat(bookForm.price),
                    });
                  }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="bookTitle">Title</Label>
                        <Input
                          id="bookTitle"
                          value={bookForm.title}
                          onChange={(e) => setBookForm(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="bookCategory">Category</Label>
                        <Select value={bookForm.category} onValueChange={(value) => setBookForm(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Leadership">Leadership</SelectItem>
                            <SelectItem value="Personal Development">Personal Development</SelectItem>
                            <SelectItem value="Business Strategy">Business Strategy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bookDescription">Description</Label>
                      <Textarea
                        id="bookDescription"
                        value={bookForm.description}
                        onChange={(e) => setBookForm(prev => ({ ...prev, description: e.target.value }))}
                        required
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="bookPrice">Price ($)</Label>
                        <Input
                          id="bookPrice"
                          type="number"
                          step="0.01"
                          value={bookForm.price}
                          onChange={(e) => setBookForm(prev => ({ ...prev, price: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="bookCover">Cover Image URL</Label>
                        <Input
                          id="bookCover"
                          value={bookForm.coverImageUrl}
                          onChange={(e) => setBookForm(prev => ({ ...prev, coverImageUrl: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bookPdf">PDF URL (optional)</Label>
                      <Input
                        id="bookPdf"
                        value={bookForm.pdfUrl}
                        onChange={(e) => setBookForm(prev => ({ ...prev, pdfUrl: e.target.value }))}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={createBookMutation.isPending}
                      className="bg-accent text-white hover:bg-blue-600"
                    >
                      {createBookMutation.isPending ? "Creating..." : "Add Book"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Books List */}
              <Card>
                <CardHeader>
                  <CardTitle>Existing Books</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => (
                      <div key={book.id} className="border rounded-lg p-4">
                        <img
                          src={book.coverImageUrl}
                          alt={book.title}
                          className="w-full h-48 object-cover rounded mb-4"
                        />
                        <h3 className="font-bold text-primary mb-2">{book.title}</h3>
                        <p className="text-sm text-secondary mb-2 line-clamp-2">{book.description}</p>
                        <p className="text-accent font-bold mb-4">${book.price}</p>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteBookMutation.mutate(book.id)}
                          disabled={deleteBookMutation.isPending}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos" className="space-y-8">
              {/* Add Video Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Add New Video</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    createVideoMutation.mutate(videoForm);
                  }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="videoTitle">Title</Label>
                        <Input
                          id="videoTitle"
                          value={videoForm.title}
                          onChange={(e) => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="videoPlatform">Platform</Label>
                        <Select value={videoForm.platform} onValueChange={(value) => setVideoForm(prev => ({ ...prev, platform: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="YouTube">YouTube</SelectItem>
                            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                            <SelectItem value="Instagram">Instagram</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="videoDescription">Description</Label>
                      <Textarea
                        id="videoDescription"
                        value={videoForm.description}
                        onChange={(e) => setVideoForm(prev => ({ ...prev, description: e.target.value }))}
                        required
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="videoUrl">Video URL</Label>
                        <Input
                          id="videoUrl"
                          value={videoForm.videoUrl}
                          onChange={(e) => setVideoForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                        <Input
                          id="thumbnailUrl"
                          value={videoForm.thumbnailUrl}
                          onChange={(e) => setVideoForm(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="videoDuration">Duration (e.g., 24:15)</Label>
                      <Input
                        id="videoDuration"
                        value={videoForm.duration}
                        onChange={(e) => setVideoForm(prev => ({ ...prev, duration: e.target.value }))}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={createVideoMutation.isPending}
                      className="bg-accent text-white hover:bg-blue-600"
                    >
                      {createVideoMutation.isPending ? "Creating..." : "Add Video"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Videos List */}
              <Card>
                <CardHeader>
                  <CardTitle>Existing Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                      <div key={video.id} className="border rounded-lg p-4">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-32 object-cover rounded mb-4"
                        />
                        <h3 className="font-bold text-primary mb-2">{video.title}</h3>
                        <p className="text-sm text-secondary mb-2 line-clamp-2">{video.description}</p>
                        <p className="text-accent font-bold mb-4">{video.platform}</p>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteVideoMutation.mutate(video.id)}
                          disabled={deleteVideoMutation.isPending}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="stats">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Books</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-accent">{books.length}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Total Videos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-accent">{videos.length}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Featured Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-accent">
                      {books.filter(b => b.featured).length + videos.filter(v => v.featured).length}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
