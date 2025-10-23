const CACHE_NAME = 'cloudcrew-academy-v1';
const OFFLINE_PAGE = '/offline';

// Files to cache for offline functionality
const STATIC_CACHE_URLS = [
  '/',
  '/offline',
  '/login',
  '/signup',
  '/courses',
  '/dashboard',
  '/about',
  '/pricing',
  // Add critical CSS and JS files
  '/_next/static/css/',
  '/_next/static/chunks/',
  // Add icons and images
  '/favicon.ico',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/apple-touch-icon.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS.filter(url => 
          !url.includes('_next/static') // Dynamic Next.js files will be cached on demand
        ));
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate event');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Old caches cleaned up');
        return self.clients.claim(); // Take control of all pages
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // API requests - Network First strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Video content - Cache First strategy (for performance)
  if (url.pathname.includes('/videos/') || url.pathname.includes('.mp4') || url.pathname.includes('.webm')) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // Static assets - Cache First strategy
  if (url.pathname.startsWith('/_next/static/') || 
      url.pathname.startsWith('/static/') ||
      url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|ico|woff|woff2)$/)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // HTML pages - Stale While Revalidate strategy
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  
  // Default - Network First
  event.respondWith(networkFirst(request));
});

// Network First strategy - for API calls and critical data
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network First: Network failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_PAGE);
    }
    
    throw error;
  }
}

// Cache First strategy - for static assets and videos
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetch(request).then(response => {
      if (response.ok) {
        const cache = caches.open(CACHE_NAME);
        cache.then(c => c.put(request, response.clone()));
      }
    }).catch(() => {}); // Ignore background update errors
    
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Cache First: Network failed for:', request.url);
    throw error;
  }
}

// Stale While Revalidate strategy - for HTML pages
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in parallel
  const networkPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  
  // Return cached version immediately if available
  if (cachedResponse) {
    networkPromise.catch(() => {}); // Ignore network errors when we have cache
    return cachedResponse;
  }
  
  // If no cache, wait for network
  try {
    const networkResponse = await networkPromise;
    if (networkResponse) {
      return networkResponse;
    }
  } catch (error) {
    console.log('Stale While Revalidate: Network failed:', request.url);
  }
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    return cache.match(OFFLINE_PAGE);
  }
  
  throw new Error('No cache available and network failed');
}

// Push notification event handler
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  if (!event.data) {
    return;
  }
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    image: data.image,
    data: data.data,
    actions: [
      {
        action: 'view',
        title: 'View Course',
        icon: '/icons/view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss.png'
      }
    ],
    tag: data.tag || 'cloudcrew-notification',
    renotify: true,
    requireInteraction: true
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'dismiss') {
    return;
  }
  
  // Default action or 'view' action
  let targetUrl = '/dashboard';
  
  if (data?.courseId) {
    targetUrl = `/courses/${data.courseId}`;
  } else if (data?.url) {
    targetUrl = data.url;
  }
  
  event.waitUntil(
    clients.matchAll({ includeUncontrolled: true, type: 'window' })
      .then((windowClients) => {
        // Check if there's already a window open
        for (const client of windowClients) {
          if (client.url.includes(targetUrl) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window if none found
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// Background sync event handler
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'course-progress-sync') {
    event.waitUntil(syncCourseProgress());
  } else if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

// Sync course progress when back online
async function syncCourseProgress() {
  try {
    console.log('Service Worker: Syncing course progress');
    
    // Get pending progress updates from IndexedDB
    const pendingUpdates = await getPendingProgressUpdates();
    
    for (const update of pendingUpdates) {
      try {
        const response = await fetch('/api/progress/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(update)
        });
        
        if (response.ok) {
          // Remove from pending updates
          await removePendingProgressUpdate(update.id);
          console.log('Service Worker: Progress update synced:', update.id);
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync progress update:', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed:', error);
  }
}

// Sync analytics data when back online
async function syncAnalytics() {
  try {
    console.log('Service Worker: Syncing analytics data');
    
    // Get pending analytics events from IndexedDB
    const pendingEvents = await getPendingAnalyticsEvents();
    
    for (const event of pendingEvents) {
      try {
        const response = await fetch('/api/analytics/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event)
        });
        
        if (response.ok) {
          await removePendingAnalyticsEvent(event.id);
          console.log('Service Worker: Analytics event synced:', event.id);
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync analytics event:', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Analytics sync failed:', error);
  }
}

// Helper functions for IndexedDB operations
async function getPendingProgressUpdates() {
  // Implementation would use IndexedDB to get pending updates
  return [];
}

async function removePendingProgressUpdate(id) {
  // Implementation would remove from IndexedDB
}

async function getPendingAnalyticsEvents() {
  // Implementation would use IndexedDB to get pending events
  return [];
}

async function removePendingAnalyticsEvent(id) {
  // Implementation would remove from IndexedDB
}

// Message event handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  } else if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});