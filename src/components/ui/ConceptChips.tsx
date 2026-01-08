import { motion } from 'framer-motion';

interface Concept {
  name: string;
  explanation: string;
}

interface ConceptChipsProps {
  concepts: Concept[];
  className?: string;
}

export function ConceptChips({ concepts, className = '' }: ConceptChipsProps) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {concepts.map((concept, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
          className="relative group"
        >
          <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-[#4DFFFF]/10 to-[#9A4DFF]/10 rounded-xl border border-white/10 group-hover:border-[#4DFFFF]/30 transition-colors" />
          <div className="relative z-10 p-4 min-w-[200px]">
            <h4 className="text-white font-semibold mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              {concept.name}
            </h4>
            <p className="text-white/70 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              {concept.explanation}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
