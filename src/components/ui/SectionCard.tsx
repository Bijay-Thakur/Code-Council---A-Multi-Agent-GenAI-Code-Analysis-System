import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ title, subtitle, children, className = '' }: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      <div className="absolute inset-0 backdrop-blur-xl bg-white/[0.05] rounded-2xl border border-white/10" />
      <div className="relative z-10 p-6">
        <div className="mb-4">
          <h3 className="text-lg text-white font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-white/60 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </motion.div>
  );
}
