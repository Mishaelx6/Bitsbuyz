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
import type { Book, Video, HomepageContent, SiteContent } from "@shared/schema";

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

  const { data: siteContent } = useQuery<SiteContent>({
    queryKey: ["/api/site-content"],
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

  // Site content form state
  const [siteForm, setSiteForm] = useState({
    siteName: "",
    navHome: "",
    navBooks: "",
    navVideos: "",
    navAdmin: "",
    booksPageTitle: "",
    booksPageSubtitle: "",
    videosPageTitle: "",
    videosPageSubtitle: "",
    footerDescription: "",
    footerCopyright: "",
    footerLinks: "",
    contactTitle: "",
    contactSubtitle: "",
    contactButtonText: "",
    whatIDoTitle: "",
    whatIDoSubtitle: "",
    linkedinUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
    instagramUrl: "",
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

  // Update site form when data loads
  useEffect(() => {
    if (siteContent) {
      setSiteForm({
        siteName: siteContent.siteName || "",
        navHome: siteContent.navHome || "",
        navBooks: siteContent.navBooks || "",
        navVideos: siteContent.navVideos || "",
        navAdmin: siteContent.navAdmin || "",
        booksPageTitle: siteContent.booksPageTitle || "",
        booksPageSubtitle: siteContent.booksPageSubtitle || "",
        videosPageTitle: siteContent.videosPageTitle || "",
        videosPageSubtitle: siteContent.videosPageSubtitle || "",
        footerDescription: siteContent.footerDescription || "",
        footerCopyright: siteContent.footerCopyright || "",
        footerLinks: siteContent.footerLinks || "",
        contactTitle: siteContent.contactTitle || "",
        contactSubtitle: siteContent.contactSubtitle || "",
        contactButtonText: siteContent.contactButtonText || "",
        whatIDoTitle: siteContent.whatIDoTitle || "",
        whatIDoSubtitle: siteContent.whatIDoSubtitle || "",
        linkedinUrl: siteContent.linkedinUrl || "",
        twitterUrl: siteContent.twitterUrl || "",
        youtubeUrl: siteContent.youtubeUrl || "",
        instagramUrl: siteContent.instagramUrl || "",
      });
    }
  }, [siteContent]);

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

  // Site content mutation
  const updateSiteContentMutation = useMutation({
    mutationFn: async (content: any) => {
      await apiRequest("PUT", "/api/site-content", content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-content"] });
      toast({ title: "Success", description: "Site content updated successfully" });
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
      toast({ title: "Error", description: "Failed to update site content", variant: "destructive" });
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="homepage">Homepage</TabsTrigger>
              <TabsTrigger value="site-content">Site Content</TabsTrigger>
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

            {/* Site Content Tab */}
            <TabsContent value="site-content">
              <Card>
                <CardHeader>
                  <CardTitle>Site Content Management</CardTitle>
                  <p className="text-sm text-gray-600">
                    Edit all text content across your website, including navigation, page titles, and social links.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    updateSiteContentMutation.mutate(siteForm);
                  }} className="space-y-8">
                    
                    {/* Navigation Section */}
                    <div className="border p-6 rounded-lg bg-gray-50">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Navigation</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="siteName">Site Name</Label>
                          <Input
                            id="siteName"
                            value={siteForm.siteName}
                            onChange={(e) => setSiteForm(prev => ({ ...prev, siteName: e.target.value }))}
                            placeholder="Dr. Sarah Johnson"
                          />
                        </div>
                        <div>
                          <Label htmlFor="navHome">Home Link Text</Label>
                          <Input
                            id="navHome"
                            value={siteForm.navHome}
                            onChange={(e) => setSiteForm(prev => ({ ...prev, navHome: e.target.value }))}
                            placeholder="Home"
                          />
                        </div>
                        <div>
                          <Label htmlFor="navBooks">Books Link Text</Label>
                          <Input
                            id="navBooks"
                            value={siteForm.navBooks}
                            onChange={(e) => setSiteForm(prev => ({ ...prev, navBooks: e.target.value }))}
                            placeholder="Books"
                          />
                        </div>
                        <div>
                          <Label htmlFor="navVideos">Videos Link Text</Label>
                          <Input
                            id="navVideos"
                            value={siteForm.navVideos}
                            onChange={(e) => setSiteForm(prev => ({ ...prev, navVideos: e.target.value }))}
                            placeholder="Videos"
                          />
                        </div>
                        <div>
                          <Label htmlFor="navAdmin">Admin Link Text</Label>
                          <Input
                            id="navAdmin"
                            value={siteForm.navAdmin}
                            onChange={(e) => setSiteForm(prev => ({ ...prev, navAdmin: e.target.value }))}
                            placeholder="Admin"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Page Titles Section */}
                    <div className="border p-6 rounded-lg bg-blue-50">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Page Titles & Subtitles</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="booksPageTitle">Books Page Title</Label>
                          <Input
                            id="booksPageTitle"
                            value={siteForm.booksPageTitle}
                            onChange={(e) => setSiteForm(prev => ({ ...prev, booksPageTitle: e.target.value }))}
                            placeholder="Leadership Library"
                          />
                        </div>
                        <div>
                          <Label htmlFor="booksPageSubtitle">Books Page Subtitle</Label>
                          <Input
                            id="booksPageSubtitle"
                            value={siteForm.booksPageSubtitle}
                            onChange={(e) => setSiteForm(prev => ({ ...prev, booksPageSubtitle: e.target.value }))}
                            placeholder="Transformative insights for modern leaders"
                          />
                        </div>
                        <div>
                          <Label htmlFor="videosPageTitle">Videos Page Title</Label>
                          <Input
                            id="videosPageTitle"
                            value={siteForm.videosPageTitle}
                            onChange={(e) => setSiteForm(prev => ({ ...prev, videosPageTitle: e.target.value }))}
                            placeholder="Video Collection"
                          />
                        </div>
                        <div>
                          <Label htmlFor="videosPageSubtitle">Videos Page Subtitle</Label>
                          <Input
                            id="videosPageSubtitle"
                            value={siteForm.videosPageSubtitle}
                            onChange={(e) => setSiteForm(prev => ({ ...prev, videosPageSubtitle: e.target.value }))}
                            placeholder="Inspiring talks and insights"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact & What I Do Section */}
                    <div className="border p-6 rounded-lg bg-green-50">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact & What I Do</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="contactTitle">Contact Section Title</Label>
                          <Input
                            id="contactTitle"
                            value={siteForm.contactTitle}
                            onChange={(e) => setSiteForm(prev => ({ ...prev, contactTitle: e.target.value }))}
                            placeholder="Get In Touch"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactSubtitle">Contact Section Subtitle</Label>
                          <Input
                            id="contactSubtitle"
                            value={siteForm.contactSubtitle}
                            onChange={(e) => setSiteForm(prev => ({ ...prev, contactSubtitle: e.target.value }))}
                            placeholder="Ready to transform your leadership journey?"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactButtonText">Contact Button Text</Label>
                          <Input
                            id="contactButtonText"
                            value={siteForm.contactButtonText}
                            onChange={(e) => setSiteForm(prev => ({ ...prev, contactButtonText: e.target.value }))}
                            placeholder="Schedule a Consultation"
                          />
                        </div>
                        <div>
                          <Label htmlFor="whatIDoSubtitle">What I Do Section Subtitle</Label>
                          <Input
                            id="whatIDoSubtitle"
                            value={siteForm.whatIDoSubtitle}
                            onChange={(e) => setSiteForm(prev => ({ ...prev, whatIDoSubtitle: e.target.value }))}
                            placeholder="Empowering leaders through research-based insights"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="border p-6 rounded-lg bg-purple-50">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Social Media Links</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                          <Input
                            id="linkedinUrl"
                            value={siteForm.linkedinUrl}
                            onChange={(e) => setSiteForm(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                            placeholder="https://linkedin.com/in/..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="twitterUrl">Twitter/X URL</Label>
                          <Input
                            id="twitterUrl"
                            value={siteForm.twitterUrl}
                            onChange={(e) => setSiteForm(prev => ({ ...prev, twitterUrl: e.target.value }))}
                            placeholder="https://twitter.com/..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="youtubeUrl">YouTube URL</Label>
                          <Input
                            id="youtubeUrl"
                            value={siteForm.youtubeUrl}
                            onChange={(e) => setSiteForm(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                            placeholder="https://youtube.com/@..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="instagramUrl">Instagram URL</Label>
                          <Input
                            id="instagramUrl"
                            value={siteForm.instagramUrl}
                            onChange={(e) => setSiteForm(prev => ({ ...prev, instagramUrl: e.target.value }))}
                            placeholder="https://instagram.com/..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer Section */}
                    <div className="border p-6 rounded-lg bg-orange-50">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Footer Content</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="footerDescription">Footer Description</Label>
                          <Textarea
                            id="footerDescription"
                            value={siteForm.footerDescription}
                            onChange={(e) => setSiteForm(prev => ({ ...prev, footerDescription: e.target.value }))}
                            placeholder="Empowering leaders worldwide through transformative insights and proven strategies."
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="footerCopyright">Copyright Text</Label>
                            <Input
                              id="footerCopyright"
                              value={siteForm.footerCopyright}
                              onChange={(e) => setSiteForm(prev => ({ ...prev, footerCopyright: e.target.value }))}
                              placeholder="© 2025 Dr. Sarah Johnson. All rights reserved."
                            />
                          </div>
                          <div>
                            <Label htmlFor="footerLinks">Footer Links (JSON format)</Label>
                            <Input
                              id="footerLinks"
                              value={siteForm.footerLinks}
                              onChange={(e) => setSiteForm(prev => ({ ...prev, footerLinks: e.target.value }))}
                              placeholder='[{"text": "Privacy Policy", "url": "/privacy"}]'
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={updateSiteContentMutation.isPending}
                      className="bg-accent text-white hover:bg-blue-600 w-full md:w-auto"
                    >
                      {updateSiteContentMutation.isPending ? "Updating..." : "Update Site Content"}
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
                  <p className="text-sm text-gray-600">
                    Add books to your collection. Featured books will appear on the homepage.
                  </p>
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
                        placeholder="https://example.com/book.pdf"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="bookFeatured"
                        checked={bookForm.featured}
                        onChange={(e) => setBookForm(prev => ({ ...prev, featured: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="bookFeatured">Feature this book on the homepage</Label>
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
                  <CardTitle>Add New YouTube Video</CardTitle>
                  <p className="text-sm text-gray-600">
                    Simply paste a YouTube URL and the system will automatically extract the thumbnail and set the platform.
                  </p>
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

                    <div>
                      <Label htmlFor="videoUrl">YouTube Video URL</Label>
                      <Input
                        id="videoUrl"
                        value={videoForm.videoUrl}
                        onChange={(e) => {
                          const url = e.target.value;
                          setVideoForm(prev => ({ ...prev, videoUrl: url }));
                          
                          // Auto-extract YouTube video ID and generate thumbnail
                          if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
                            const videoId = url.includes('youtube.com/watch?v=') 
                              ? url.split('v=')[1]?.split('&')[0]
                              : url.split('youtu.be/')[1]?.split('?')[0];
                            
                            if (videoId) {
                              setVideoForm(prev => ({ 
                                ...prev, 
                                platform: 'YouTube',
                                thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                              }));
                            }
                          }
                        }}
                        placeholder="https://www.youtube.com/watch?v=..."
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Enter a YouTube URL and the thumbnail will be generated automatically
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                      <Input
                        id="thumbnailUrl"
                        value={videoForm.thumbnailUrl}
                        onChange={(e) => setVideoForm(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                        placeholder="Auto-generated from YouTube URL or enter custom URL"
                        required
                      />
                      {videoForm.thumbnailUrl && (
                        <div className="mt-2">
                          <img 
                            src={videoForm.thumbnailUrl} 
                            alt="Thumbnail preview" 
                            className="w-32 h-18 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="videoDuration">Duration (e.g., 24:15)</Label>
                      <Input
                        id="videoDuration"
                        value={videoForm.duration}
                        onChange={(e) => setVideoForm(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="Optional: 24:15"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="videoFeatured"
                        checked={videoForm.featured}
                        onChange={(e) => setVideoForm(prev => ({ ...prev, featured: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="videoFeatured">Feature this video on the homepage</Label>
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
