/** @jsxImportSource preact */
// @ts-nocheck
import { FunctionalComponent } from 'preact';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Particles } from './Particles';

export interface DeltaBadgeProps {
  value: number;
  formatNumber: (n: number | undefined | null) => string;
}

export const DeltaBadge: FunctionalComponent<DeltaBadgeProps> = ({
  value,
  formatNumber,
}) => {
  const prefersReducedMotion = useReducedMotion();
  if (value <= 0) return null;
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ opacity: 0, scale: 0.6, y: -4, filter: 'blur(2px)' }}
        animate={{
          opacity: 1,
          scale: 1.08,
          y: -10,
          filter: 'blur(0px)',
          transition: {
            type: 'spring',
            stiffness: 560,
            damping: 32,
            mass: 0.36,
          },
        }}
        exit={{
          opacity: 0,
          scale: 0.4,
          y: -17,
          filter: 'blur(2px)',
          transition: { duration: 0.18 },
        }}
        className="absolute -top-[1.1rem] -right-1 pr-[1px] pointer-events-none select-none font-semibold tracking-tight text-[13px] leading-none tabular-nums text-[var(--delta-accent,#79cfff)]"
        aria-label={`New logs: +${formatNumber(value)}`}
      >
        {!prefersReducedMotion && (
          <motion.span
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(140,220,255,0.6)_0%,rgba(140,220,255,0)_72%)]"
            initial={{ opacity: 0.75, scale: 0.26 }}
            animate={{ opacity: [0.75, 0.22, 0.75], scale: [0.26, 1.06, 0.26] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <motion.span
          aria-hidden
          className="absolute left-0 right-0 -bottom-[3px] h-[1.5px] origin-center bg-gradient-to-r from-transparent via-[var(--delta-accent,#79cfff)] to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.9 }}
          exit={{ scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
        {!prefersReducedMotion && <Particles seed={value} />}
        <span className="relative z-10 drop-shadow-[0_0_3px_rgba(121,207,255,0.55)]">
          +{formatNumber(value)}
        </span>
      </motion.span>
    </AnimatePresence>
  );
};
