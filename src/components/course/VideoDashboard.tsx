"use client";

import React, { useState, useEffect } from 'react';
import { Play, Clock, Users, TrendingUp, Download, Search, Filter, Grid, List } from 'lucide-react';
import { VideoStorage, VideoMetadata, VideoAnalytics } from '@/lib/video';
import { VideoPlayer } from './VideoPlayer';

interface VideoDashboardProps {
  courseId?: string;
  showAnalytics?: boolean;
}

export function VideoDashboard({ courseId, showAnalytics = false }: VideoDashboardProps) {
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoMetadata | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load videos on component mount
  useEffect(() => {
    const loadVideos = () => {
      setIsLoading(true);
      try {
        const videoData = courseId 
          ? VideoStorage.getVideosByCourse(courseId)
          : VideoStorage.getVideosByCourse('aws-fundamentals'); // Default course
        
        setVideos(videoData);
      } catch (error) {
        console.error('Error loading videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, [courseId]);

  // Filter videos based on search and tag filter
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag === 'all' || video.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  // Get unique tags for filter dropdown
  const availableTags = ['all', ...Array.from(new Set(videos.flatMap(video => video.tags)))];

  const handleVideoSelect = (video: VideoMetadata) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const handleVideoComplete = () => {
    // Mark video as completed and move to next
    if (selectedVideo) {
      const currentIndex = filteredVideos.findIndex(v => v.id === selectedVideo.id);
      const nextVideo = filteredVideos[currentIndex + 1];
      if (nextVideo) {
        setSelectedVideo(nextVideo);
      } else {
        setSelectedVideo(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (selectedVideo) {
    return (
      <div className="space-y-6">
        {/* Video Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-dark-text-primary">{selectedVideo.title}</h2>
            <p className="text-dark-text-secondary mt-1">{selectedVideo.description}</p>
          </div>
          <button
            onClick={handleCloseVideo}
            className="px-4 py-2 bg-dark-bg-secondary text-dark-text-primary rounded-lg hover:bg-dark-bg-tertiary transition-colors duration-200"
          >
            Back to Videos
          </button>
        </div>

        {/* Video Player */}
        <VideoPlayer
          src={VideoStorage.getOptimalSource(selectedVideo).url}
          title={selectedVideo.title}
          videoId={selectedVideo.id}
          userId="current-user"
          poster={selectedVideo.thumbnail}
          onComplete={handleVideoComplete}
        />

        {/* Video Info */}
        <div className="bg-dark-bg-card rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-dark-text-primary mb-2">Video Details</h3>
              <div className="space-y-2 text-sm text-dark-text-secondary">
                <div>Duration: {VideoStorage.formatDuration(selectedVideo.duration)}</div>
                <div>Quality: {VideoStorage.getOptimalSource(selectedVideo).quality}</div>
                <div>Status: <span className="text-green-400">{selectedVideo.status}</span></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-dark-text-primary mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedVideo.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded-md text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-dark-text-primary mb-2">Transcripts</h3>
              {selectedVideo.transcripts && selectedVideo.transcripts.length > 0 ? (
                <div className="space-y-1">
                  {selectedVideo.transcripts.map(transcript => (
                    <a
                      key={transcript.language}
                      href={transcript.url}
                      className="block text-sm text-primary-400 hover:text-primary-300 transition-colors duration-200"
                    >
                      Download {transcript.language.toUpperCase()} Transcript
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-dark-text-secondary">No transcripts available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark-text-primary">Video Library</h2>
          <p className="text-dark-text-secondary mt-1">
            {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === 'grid' 
                ? 'bg-primary-500 text-white' 
                : 'bg-dark-bg-secondary text-dark-text-secondary hover:bg-dark-bg-tertiary'
            }`}
            aria-label="Grid view"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === 'list' 
                ? 'bg-primary-500 text-white' 
                : 'bg-dark-bg-secondary text-dark-text-secondary hover:bg-dark-bg-tertiary'
            }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary w-4 h-4" />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-bg-secondary text-dark-text-primary border border-dark-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary w-4 h-4" />
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="pl-10 pr-8 py-2 bg-dark-bg-secondary text-dark-text-primary border border-dark-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
          >
            {availableTags.map(tag => (
              <option key={tag} value={tag}>
                {tag === 'all' ? 'All Tags' : `#${tag}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Videos Grid/List */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-dark-text-secondary">No videos found matching your criteria.</p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {filteredVideos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              viewMode={viewMode}
              onSelect={handleVideoSelect}
            />
          ))}
        </div>
      )}

      {/* Analytics Section */}
      {showAnalytics && (
        <div className="mt-12">
          <h3 className="text-xl font-bold text-dark-text-primary mb-6">Video Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-bg-card rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-text-secondary text-sm">Total Videos</p>
                  <p className="text-2xl font-bold text-dark-text-primary">{videos.length}</p>
                </div>
                <Play className="w-8 h-8 text-primary-400" />
              </div>
            </div>
            
            <div className="bg-dark-bg-card rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-text-secondary text-sm">Total Duration</p>
                  <p className="text-2xl font-bold text-dark-text-primary">
                    {VideoStorage.formatDuration(videos.reduce((acc, video) => acc + video.duration, 0))}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-accent-400" />
              </div>
            </div>
            
            <div className="bg-dark-bg-card rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-text-secondary text-sm">Completion Rate</p>
                  <p className="text-2xl font-bold text-dark-text-primary">78%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface VideoCardProps {
  video: VideoMetadata;
  viewMode: 'grid' | 'list';
  onSelect: (video: VideoMetadata) => void;
}

function VideoCard({ video, viewMode, onSelect }: VideoCardProps) {
  const optimalSource = VideoStorage.getOptimalSource(video);
  
  if (viewMode === 'list') {
    return (
      <div 
        className="bg-dark-bg-card rounded-xl p-6 hover:bg-dark-bg-elevated transition-colors duration-200 cursor-pointer"
        onClick={() => onSelect(video)}
      >
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-dark-bg-secondary flex-shrink-0">
            {video.thumbnail ? (
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="w-6 h-6 text-dark-text-secondary" />
              </div>
            )}
            <div className="absolute bottom-1 right-1 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
              {VideoStorage.formatDuration(video.duration)}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-dark-text-primary truncate">{video.title}</h3>
            <p className="text-dark-text-secondary text-sm mt-1 line-clamp-2">{video.description}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-dark-text-secondary">
              <span>Quality: {optimalSource.quality}</span>
              <span>Size: {(optimalSource.size / (1024 * 1024)).toFixed(1)} MB</span>
              <span className={`px-2 py-1 rounded-full ${
                video.status === 'ready' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {video.status}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle download
              }}
              className="p-2 text-dark-text-secondary hover:text-primary-400 transition-colors duration-200"
              aria-label="Download video"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-dark-bg-card rounded-xl overflow-hidden hover:bg-dark-bg-elevated transition-colors duration-200 cursor-pointer"
      onClick={() => onSelect(video)}
    >
      <div className="relative aspect-video bg-dark-bg-secondary">
        {video.thumbnail ? (
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-12 h-12 text-dark-text-secondary" />
          </div>
        )}
        
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
          {VideoStorage.formatDuration(video.duration)}
        </div>
        
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Play className="w-6 h-6 text-white ml-1" />
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-dark-text-primary mb-2 line-clamp-2">{video.title}</h3>
        <p className="text-dark-text-secondary text-sm mb-3 line-clamp-2">{video.description}</p>
        
        <div className="flex items-center justify-between text-xs text-dark-text-secondary">
          <span>{optimalSource.quality}</span>
          <span className={`px-2 py-1 rounded-full ${
            video.status === 'ready' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {video.status}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {video.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded-md text-xs"
            >
              #{tag}
            </span>
          ))}
          {video.tags.length > 3 && (
            <span className="px-2 py-1 bg-dark-bg-secondary text-dark-text-secondary rounded-md text-xs">
              +{video.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoDashboard;