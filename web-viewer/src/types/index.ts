export type NetVisionLog = {
  type: 'network-log';
  method: string;
  url: string;
  duration: number;
  status: number;
  requestHeaders: Record<string, string[]>;
  responseHeaders: Record<string, string[]>;
  requestBody?: string | Record<string, any> | any[];
  responseBody?: string | Record<string, any> | any[];
  cookies?: {
    request?: Record<string, string>;
    response?: Record<string, string>;
  };
  timestamp: number; // local server time, ISO string
};

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}
