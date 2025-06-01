import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, ReactNode } from 'react';

interface FadeInOnViewProps {
  children: ReactNode;
  className?: string;
}

export function FadeInOnView({ children, className = '' }: FadeInOnViewProps) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.6 }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
} 