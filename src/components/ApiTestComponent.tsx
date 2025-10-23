import { useState, useEffect } from 'react';

interface Course {
  courseId: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  tier: string;
  modules: number;
}

export default function ApiTestComponent() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApiConnection = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        console.log('Testing API connection to:', apiUrl);
        
        const response = await fetch(`${apiUrl}/api/courses`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        setCourses(data.courses || []);
      } catch (err) {
        console.error('API Test Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    testApiConnection();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">API Connection Test</h2>
      
      <div className="mb-4 p-3 bg-gray-100 rounded">
        <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</p>
        <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">Testing API connection...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <strong>Success!</strong> API connection established. Found {courses.length} courses.
        </div>
      )}

      {courses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Available Courses:</h3>
          {courses.map((course) => (
            <div key={course.courseId} className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-bold text-lg">{course.title}</h4>
              <p className="text-gray-600 mb-2">{course.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <span><strong>Difficulty:</strong> {course.difficulty}</span>
                <span><strong>Duration:</strong> {course.duration}</span>
                <span><strong>Tier:</strong> {course.tier}</span>
                <span><strong>Modules:</strong> {course.modules}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}