/** @jsxImportSource preact */
import { VNode } from 'preact';
import { motion } from 'framer-motion';

interface LoaderSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * LoaderSpinner - Ultra-polished glassmorphism loading animation
 * Clean, elegant spinning ring with smooth gradient using Framer Motion
 */
export const LoaderSpinner = ({
  size = 'md',
  className = '',
}: LoaderSpinnerProps): VNode => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        ${className}
        relative inline-flex items-center justify-center
      `}
      role="status"
      aria-label="Loading search results"
    >
      {/* Elegant spinning ring with gradient - Framer Motion powered */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={
          {
            background: `conic-gradient(from 0deg, transparent 20%, rgba(99, 102, 241, 0.3) 50%, rgba(139, 92, 246, 0.8) 80%, rgba(236, 72, 153, 1) 100%)`,
            mask: `radial-gradient(circle at center, transparent 50%, black 52%, black 100%)`,
            WebkitMask: `radial-gradient(circle at center, transparent 50%, black 52%, black 100%)`,
          } as any
        }
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.2,
          ease: 'linear',
          repeat: Infinity,
        }}
      />

      {/* Secondary gradient layer for depth */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-40"
        style={
          {
            background: `conic-gradient(from 90deg, transparent 0%, rgba(99, 102, 241, 0.6) 25%, transparent 50%)`,
            mask: `radial-gradient(circle at center, transparent 50%, black 52%, black 100%)`,
            WebkitMask: `radial-gradient(circle at center, transparent 50%, black 52%, black 100%)`,
          } as any
        }
        animate={{ rotate: -360 }}
        transition={{
          duration: 1.8,
          ease: 'linear',
          repeat: Infinity,
        }}
      />

      {/* Subtle center highlight */}
      <div
        className="absolute inset-2 rounded-full opacity-30"
        style={
          {
            background: `radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 60%)`,
          } as any
        }
      />
    </div>
  );
};
