"use client";

import { useState } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Upload, Video, CheckCircle, AlertCircle, Loader } from "lucide-react";

interface VideoMetadata {
  title: string;
  description: string;
  courseId: string;
  order: number;
  thumbnail?: string;
}

export default function AdminVideoUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata>({
    title: "",
    description: "",
    courseId: "aws-fundamentals",
    order: 1,
    thumbnail: ""
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }
      setFile(selectedFile);
      setUploadStatus('idle');
    }
  };

  const handleMetadataChange = (field: keyof VideoMetadata, value: string | number) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a video file');
      return;
    }

    if (!metadata.title || !metadata.courseId) {
      alert('Please fill in title and course ID');
      return;
    }

    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);
    setErrorMessage("");

    try {
      // Step 1: Get presigned upload URL
      const uploadUrlResponse = await fetch('/api/videos/upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          courseId: metadata.courseId
        })
      });

      console.log('Upload URL Response Status:', uploadUrlResponse.status);
      
      if (!uploadUrlResponse.ok) {
        const errorText = await uploadUrlResponse.text();
        console.error('Upload URL error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        throw new Error(errorData.error || 'Failed to get upload URL');
      }

      const { uploadUrl, videoId, key } = await uploadUrlResponse.json();

      // Step 2: Upload file to S3
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', async () => {
        if (xhr.status === 200) {
          // Step 3: Save video metadata
          try {
            const metadataResponse = await fetch('/api/videos/metadata', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                videoId,
                ...metadata,
                duration: 0 // Will be updated later with actual video duration
              })
            });

            if (!metadataResponse.ok) {
              throw new Error('Failed to save video metadata');
            }

            const cloudFrontDomain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN;
            const videoUrl = `https://${cloudFrontDomain}/videos/${videoId}`;
            
            setVideoUrl(videoUrl);
            setUploadStatus('success');
            setUploadProgress(100);
          } catch (error) {
            console.error('Metadata save error:', error);
            setUploadStatus('error');
            setErrorMessage('Video uploaded but failed to save metadata');
          }
        } else {
          setUploadStatus('error');
          setErrorMessage(`Upload failed with status: ${xhr.status}`);
        }
        setIsUploading(false);
      });

      xhr.addEventListener('error', () => {
        setUploadStatus('error');
        setErrorMessage('Network error during upload');
        setIsUploading(false);
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setMetadata({
      title: "",
      description: "",
      courseId: "aws-fundamentals",
      order: 1,
      thumbnail: ""
    });
    setUploadProgress(0);
    setUploadStatus('idle');
    setErrorMessage("");
    setVideoUrl("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold gradient-text mb-2">
              Upload Course Video
            </h1>
            <p className="text-text-secondary">
              Upload videos to CloudFront CDN for fast global delivery
            </p>
          </div>

          {/* Upload Form */}
          <div className="card space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Video File
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent-400 transition-colors">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="video-upload"
                  disabled={isUploading}
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  <Video className="w-12 h-12 text-accent-400 mx-auto mb-4" />
                  {file ? (
                    <div>
                      <p className="text-text font-medium">{file.name}</p>
                      <p className="text-text-secondary text-sm">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-text font-medium mb-1">Click to select video</p>
                      <p className="text-text-secondary text-sm">MP4, WebM, or MOV</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Metadata Form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-text mb-2">
                  Video Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={metadata.title}
                  onChange={(e) => handleMetadataChange('title', e.target.value)}
                  className="input w-full"
                  placeholder="e.g., Introduction to AWS Lambda"
                  disabled={isUploading}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-text mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={metadata.description}
                  onChange={(e) => handleMetadataChange('description', e.target.value)}
                  className="input w-full h-24"
                  placeholder="Brief description of the video content..."
                  disabled={isUploading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="courseId" className="block text-sm font-medium text-text mb-2">
                    Course ID *
                  </label>
                  <select
                    id="courseId"
                    value={metadata.courseId}
                    onChange={(e) => handleMetadataChange('courseId', e.target.value)}
                    className="input w-full"
                    disabled={isUploading}
                  >
                    <option value="aws-fundamentals">AWS Fundamentals</option>
                    <option value="serverless-development">Serverless Development</option>
                    <option value="cloud-architecture">Cloud Architecture</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-text mb-2">
                    Lesson Order
                  </label>
                  <input
                    type="number"
                    id="order"
                    value={metadata.order}
                    onChange={(e) => handleMetadataChange('order', parseInt(e.target.value))}
                    className="input w-full"
                    min="1"
                    disabled={isUploading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="thumbnail" className="block text-sm font-medium text-text mb-2">
                  Thumbnail URL (optional)
                </label>
                <input
                  type="url"
                  id="thumbnail"
                  value={metadata.thumbnail}
                  onChange={(e) => handleMetadataChange('thumbnail', e.target.value)}
                  className="input w-full"
                  placeholder="https://..."
                  disabled={isUploading}
                />
              </div>
            </div>

            {/* Upload Progress */}
            {uploadStatus === 'uploading' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Uploading...</span>
                  <span className="text-accent-400 font-medium">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-background-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-500 to-primary-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Success Message */}
            {uploadStatus === 'success' && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-green-400 font-medium mb-1">Video uploaded successfully!</p>
                  <p className="text-sm text-text-secondary break-all">
                    CloudFront URL: {videoUrl}
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {uploadStatus === 'error' && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-400 font-medium mb-1">Upload failed</p>
                  <p className="text-sm text-text-secondary">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {uploadStatus === 'success' ? (
                <button
                  onClick={resetForm}
                  className="btn-primary flex-1"
                >
                  Upload Another Video
                </button>
              ) : (
                <>
                  <button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="btn-primary flex-1 group"
                  >
                    {isUploading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload Video</span>
                      </>
                    )}
                  </button>
                  {file && (
                    <button
                      onClick={resetForm}
                      disabled={isUploading}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-accent-500/10 border border-accent-500/20 rounded-lg">
            <h3 className="text-sm font-medium text-accent-400 mb-2">📌 Upload Guidelines</h3>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Recommended format: MP4 (H.264 video, AAC audio)</li>
              <li>• Maximum file size: 2GB per video</li>
              <li>• Videos are automatically distributed via CloudFront CDN</li>
              <li>• Allow 5-10 minutes for CDN cache propagation</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
