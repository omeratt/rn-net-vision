/** @jsxImportSource preact */
import { createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { VNode } from 'preact';
import { Toast } from '../components/atoms/Toast';

interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

interface ToastContextType {
  showToast: (
    message: string,
    type?: 'success' | 'info' | 'warning' | 'error',
    duration?: number
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: VNode | VNode[];
}

export const ToastProvider = ({ children }: ToastProviderProps): VNode => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'success',
    duration = 3000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastItem = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none max-w-md">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="pointer-events-auto"
            style={
              {
                transform: `translateY(${index * 8}px) scale(${1 - index * 0.05})`,
                zIndex: 1000 - index,
                opacity: Math.max(0.7, 1 - index * 0.15),
              } as any
            }
          >
            <Toast
              message={toast.message}
              type={toast.type}
              isVisible={true}
              onClose={() => removeToast(toast.id)}
              duration={toast.duration}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
