import { FunctionalComponent } from 'preact';
import { motion } from 'framer-motion';
import { useMemo } from 'preact/hooks';

interface ParticleDef {
  id: number;
  x: number;
  y: number;
  delay: number;
  scale: number;
  cls: string;
}

export interface ParticlesProps {
  seed: number;
  count?: number;
}

export const Particles: FunctionalComponent<ParticlesProps> = ({
  seed,
  count = 6,
}) => {
  const particles = useMemo<ParticleDef[]>(() => {
    // use seed value (value of delta) to create deterministic-ish randomness
    const rand = (i: number) => {
      const x = Math.sin(seed * 999 + i * 77) * 10000;
      return x - Math.floor(x);
    };

    const palette = [
      'from-sky-300 via-cyan-300 to-sky-400',
      'from-cyan-300 via-sky-300 to-cyan-400',
      'from-sky-200 via-sky-300 to-cyan-300',
    ];

    return Array.from({ length: count }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / count + rand(i) * 0.4;
      const radius = 12 + rand(i + 5) * 5;
      return {
        id: i,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius * 0.65,
        delay: 0.02 * i,
        scale: 0.4 + rand(i + 11) * 0.5,
        cls: palette[i % palette.length],
      };
    });
  }, [seed, count]);

  return (
    <>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          aria-hidden
          className={`absolute left-1/2 top-1/2 block w-[4px] h-[4px] rounded-sm bg-gradient-to-br ${p.cls}`}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, p.scale, 0.15],
            x: p.x,
            y: p.y,
            rotate: 140 + p.id * 60,
            filter: ['blur(0px)', 'blur(0px)', 'blur(1px)'],
          }}
          transition={{
            duration: 0.9 + p.scale * 0.2,
            delay: p.delay,
            ease: [0.4, 0.0, 0.2, 1],
          }}
        />
      ))}
    </>
  );
};
