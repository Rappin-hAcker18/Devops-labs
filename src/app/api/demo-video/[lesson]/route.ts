import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lesson = searchParams.get('lesson') || 'default';
  
  // Map lessons to appropriate educational video content
  const videoContent = {
    'aws-intro': {
      title: 'What is Cloud Computing?',
      description: 'Introduction to AWS and cloud computing fundamentals',
      duration: 900, // 15 minutes
      thumbnail: '/lesson-thumbs/aws-intro.jpg',
      // In a real app, this would be actual AWS educational video URLs
      videoUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4'
    },
    'ec2-basics': {
      title: 'EC2 Virtual Servers',
      description: 'Learn how to launch and manage EC2 instances',
      duration: 1200, // 20 minutes
      thumbnail: '/lesson-thumbs/ec2-basics.jpg',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
    },
    's3-storage': {
      title: 'S3 Cloud Storage',
      description: 'Understanding S3 buckets and object storage',
      duration: 1080, // 18 minutes
      thumbnail: '/lesson-thumbs/s3-storage.jpg',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
    }
  };

  const content = videoContent[lesson as keyof typeof videoContent] || videoContent['aws-intro'];

  return NextResponse.json({
    success: true,
    data: {
      ...content,
      // Add educational metadata
      learningObjectives: [
        'Understand core AWS concepts',
        'Learn practical implementation',
        'Gain hands-on experience'
      ],
      prerequisites: ['Basic computer knowledge'],
      difficulty: 'Beginner',
      topics: ['AWS', 'Cloud Computing', 'Infrastructure']
    }
  });
}