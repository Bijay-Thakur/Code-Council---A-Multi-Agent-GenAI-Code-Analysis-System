import { motion } from 'framer-motion';

interface Step {
  step: number;
  text: string;
}

interface StepListProps {
  steps: Step[];
  className?: string;
}

export function StepList({ steps, className = '' }: StepListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {steps.map((step, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative"
        >
          <div className="absolute inset-0 backdrop-blur-xl bg-white/[0.03] rounded-xl border border-white/10" />
          <div className="relative z-10 p-4 flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#4DFFFF] to-[#9A4DFF] flex items-center justify-center">
              <span className="text-white text-sm font-semibold">{step.step}</span>
            </div>
            <p className="text-white/80 flex-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              {step.text}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
