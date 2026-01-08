import { CheckCircle2 } from 'lucide-react';

interface BulletListProps {
  items: string[];
  className?: string;
}

export function BulletList({ items, className = '' }: BulletListProps) {
  return (
    <ul className={`space-y-2 ${className}`}>
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3 text-white/80">
          <CheckCircle2 className="w-4 h-4 text-[#4DFFFF] mt-1 flex-shrink-0" />
          <span style={{ fontFamily: 'Inter, sans-serif' }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}
