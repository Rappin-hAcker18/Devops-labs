// Global type declarations for analytics and PWA features

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'set' | 'event',
      targetId: string | object,
      config?: object
    ) => void;
    dataLayer?: any[];
  }

  interface Navigator {
    standalone?: boolean;
  }

  interface ServiceWorkerRegistration {
    sync?: {
      register(tag: string): Promise<void>;
    };
  }
}

export {};