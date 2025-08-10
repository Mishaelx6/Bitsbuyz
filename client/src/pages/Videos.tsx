import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import SearchFilters from "@/components/SearchFilters";
import type { Video } from "@shared/schema";

export default function Videos() {
  const [filters, setFilters] = useState({
    search: "",
    platform: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.append(key, value);
        }
      });
      
      const response = await fetch(`/api/videos?${params}`);
      if (!response.ok) throw new Error('Failed to fetch videos');
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Video Library</h1>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Watch keynotes, interviews, and thought leadership discussions from platforms worldwide.
            </p>
          </div>

          <SearchFilters
            filters={filters}
            onFiltersChange={setFilters}
            type="videos"
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-t-2xl"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}

          {!isLoading && videos.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-video text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No videos found</h3>
              <p className="text-gray-400">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
