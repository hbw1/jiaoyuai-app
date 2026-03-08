declare module 'expo-router' {
  import { ComponentType, ReactNode } from 'react';
  
  interface StackScreenProps {
    name: string;
    options?: any;
  }
  
  interface StackProps {
    children?: ReactNode;
  }
  
  interface TabsProps {
    screenOptions?: any;
    children?: ReactNode;
  }
  
  interface RedirectProps {
    href: string;
  }
  
  export function Stack(props: StackProps): ReactNode;
  export function Tabs(props: TabsProps): ReactNode;
  export function Screen(props: StackScreenProps): ReactNode;
  export function Redirect(props: RedirectProps): null;
  export const router: {
    push: (href: string) => void;
    replace: (href: string) => void;
    back: () => void;
  };
  export function useLocalSearchParams<T = any>(): T;
}

declare module 'expo-image-picker' {
  export const MediaTypeOptions: {
    Images: string;
    Videos: string;
    All: string;
  };
  
  export function launchImageLibraryAsync(options: {
    mediaTypes?: string;
    allowsMultipleSelection?: boolean;
    quality?: number;
  }): Promise<{ canceled: boolean; assets: { uri: string }[] }>;
  
  export function launchCameraAsync(options: {
    mediaTypes?: string;
    quality?: number;
  }): Promise<{ canceled: boolean; assets: { uri: string }[] }>;
  
  export function requestCameraPermissionsAsync(): Promise<{ status: string }>;
}

declare module '@react-native-async-storage/async-storage' {
  export function getItem(key: string): Promise<string | null>;
  export function setItem(key: string, value: string): Promise<void>;
  export function removeItem(key: string): Promise<void>;
}

declare module 'axios' {
  export interface AxiosInstance {
    get<T = any>(url: string, config?: any): Promise<{ data: T }>;
    post<T = any>(url: string, data?: any, config?: any): Promise<{ data: T }>;
    put<T = any>(url: string, data?: any, config?: any): Promise<{ data: T }>;
    delete<T = any>(url: string, config?: any): Promise<{ data: T }>;
    interceptors: {
      request: {
        use(onFulfilled: (config: any) => any, onRejected?: (error: any) => any): void;
      };
      response: {
        use(onFulfilled: (response: any) => any, onRejected?: (error: any) => any): void;
      };
    };
  }
  
  interface AxiosError {
    response?: {
      status: number;
      data: any;
    };
  }
  
  export default function create(config?: any): AxiosInstance;
  export { AxiosError };
}

declare module 'zustand' {
  export function create<T>(state: (set: any, get: any) => T): () => T;
  
  export function persist<T>(
    state: (set: any, get: any) => T,
    options: {
      name: string;
      storage?: any;
      partialize?: (state: T) => any;
    }
  ): T;
  
  export function createJSONStorage(storage: any): any;
}

declare module 'zustand/middleware' {
  export function persist<T>(
    state: (set: any, get: any) => T,
    options: {
      name: string;
      storage?: any;
      partialize?: (state: T) => any;
    }
  ): T;
  
  export function createJSONStorage(storage: any): any;
}
