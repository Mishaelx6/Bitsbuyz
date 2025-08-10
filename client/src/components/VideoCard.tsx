import { Button } from "@/components/ui/button";
import type { Video } from "@shared/schema";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'YouTube':
        return 'bg-red-600';
      case 'LinkedIn':
        return 'bg-blue-600';
      case 'Instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      default:
        return 'bg-gray-600';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'YouTube':
        return 'fab fa-youtube';
      case 'LinkedIn':
        return 'fab fa-linkedin';
      case 'Instagram':
        return 'fab fa-instagram';
      default:
        return 'fas fa-video';
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative">
        <img 
          src={video.thumbnailUrl}
          alt={`${video.title} thumbnail`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <i className="fas fa-play text-2xl text-accent ml-1"></i>
          </div>
        </div>
        <div className="absolute top-4 left-4">
          <span className={`${getPlatformColor(video.platform)} text-white px-2 py-1 rounded text-sm font-medium`}>
            <i className={`${getPlatformIcon(video.platform)} mr-1`}></i>
            {video.platform}
          </span>
        </div>
        {video.duration && (
          <div className="absolute bottom-4 right-4">
            <span className="bg-black/70 text-white px-2 py-1 rounded text-sm">{video.duration}</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary mb-2">{video.title}</h3>
        <p className="text-secondary text-sm mb-4 line-clamp-2">{video.description}</p>
        <div className="flex items-center justify-between text-sm text-secondary mb-4">
          <span>{video.views?.toLocaleString() || 0} views</span>
          <span>{new Date(video.createdAt!).toLocaleDateString()}</span>
        </div>
        <Button 
          className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
          onClick={() => window.open(video.videoUrl, '_blank')}
        >
          Watch Now
        </Button>
      </div>
    </div>
  );
}
