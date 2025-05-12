export interface NetVisionLog {
  type: 'network-log';
  method: string;
  url: string;
  duration: number;
  status: number;
  timestamp: string;
  requestHeaders: Record<string, string[]>;
  responseHeaders: Record<string, string[]>;
  requestBody?: string | Record<string, unknown> | unknown[];
  responseBody?: string | Record<string, unknown> | unknown[];
  cookies?: {
    request?: Record<string, string>;
    response?: Record<string, string>;
  };
}

export type Theme = 'light' | 'dark';

export interface WebSocketMessage {
  type: 'vite-ready' | 'network-log';
  payload?: NetVisionLog;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}
