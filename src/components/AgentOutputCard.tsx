import { motion } from 'framer-motion';
import { Bot, CheckCircle2, Loader2 } from 'lucide-react';

interface AgentOutputCardProps {
  agentId: string;
  agentName: string;
  agentColor: string;
  isAnalyzing: boolean;
  content?: string;
}

const agentContent: Record<string, { status: string; output: string }> = {
  'explainer': {
    status: 'completed',
    output: `This code implements the Fibonacci sequence using recursion. Here's how it works:

1. Base case: If n <= 1, return n directly
2. Recursive case: Calculate fibonacci(n-1) + fibonacci(n-2)
3. The function calls itself multiple times to compute the result

Example flow for fibonacci(5):
- fibonacci(5) = fibonacci(4) + fibonacci(3)
- fibonacci(4) = fibonacci(3) + fibonacci(2)
- And so on...

The code then logs the 10th Fibonacci number (55) to the console.`
  },
  'bug-hunter': {
    status: 'completed',
    output: `⚠️ Performance Issue Detected:

The recursive implementation has exponential time complexity O(2^n).

Problem:
- Each call branches into two more calls
- Many values are recalculated multiple times
- For fibonacci(10), there are 177 function calls!

Recommendation:
Use memoization or iterative approach for better performance.

Example with memoization:
const memo = {};
function fibonacci(n) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  memo[n] = fibonacci(n-1) + fibonacci(n-2);
  return memo[n];
}`
  },
  'complexity': {
    status: 'completed',
    output: `Complexity Analysis:

⏱️ Time Complexity: O(2^n)
- Exponential growth
- Each call creates 2 more calls
- Highly inefficient for large n

💾 Space Complexity: O(n)
- Call stack depth is n
- Each recursive call adds to the stack

📊 Performance Metrics:
- fibonacci(10): ~177 calls
- fibonacci(20): ~21,891 calls
- fibonacci(30): ~2,692,537 calls

Improvement suggestions:
✓ Use dynamic programming
✓ Implement iterative solution
✓ Add memoization cache`
  },
  'debate': {
    status: 'completed',
    output: `Agent A (Explainer): "The recursive solution is elegant and easy to understand."

Agent B (Bug Hunter): "But it's extremely inefficient! We should refactor."

Agent A: "True, but for small values of n, the clarity is worth it."

Agent B: "The code will fail for n > 30 due to stack overflow and performance."

Final Consensus: The code works but needs optimization for production use.`
  },
  'refined': {
    status: 'completed',
    output: `🎯 Final Refined Solution:

function fibonacci(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

console.log(fibonacci(10)); // 55

✨ Improvements:
✓ Added memoization for O(n) time complexity
✓ Maintains readable recursive structure
✓ Safe for larger values of n
✓ Production-ready implementation

Performance comparison:
- Original: O(2^n) - exponential
- Optimized: O(n) - linear

The refined version is 1000x faster for n=30!`
  }
};

export function AgentOutputCard({ agentId, agentName, agentColor, isAnalyzing, content: externalContent }: AgentOutputCardProps) {
  const defaultContent = agentContent[agentId] || { status: 'waiting', output: 'Waiting for analysis...' };
  const displayContent = externalContent !== undefined ? externalContent : defaultContent.output;
  const status = isAnalyzing ? 'running' : (externalContent ? 'completed' : defaultContent.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      {/* Glass card */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-white/[0.03] rounded-3xl border border-white/10" />
      
      <div className="relative z-10 p-6">
        {/* Agent header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Agent avatar */}
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-2xl blur-xl opacity-40"
                style={{ backgroundColor: agentColor }}
              />
              <div 
                className="relative p-3 rounded-2xl border"
                style={{ 
                  backgroundColor: `${agentColor}20`,
                  borderColor: `${agentColor}40`
                }}
              >
                <Bot className="w-6 h-6" style={{ color: agentColor }} strokeWidth={2} />
              </div>
            </div>

            {/* Agent info */}
            <div>
              <h3 className="text-lg text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
                Agent: {agentName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {status === 'running' && (
                  <>
                    <Loader2 className="w-4 h-4 text-[#4DFFFF] animate-spin" />
                    <span className="text-sm text-white/60" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Analyzing...
                    </span>
                  </>
                )}
                {status === 'completed' && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </motion.div>
                    <span className="text-sm text-green-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Completed
                    </span>
                  </>
                )}
                {status === 'waiting' && (
                  <span className="text-sm text-white/40" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Waiting...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Output area */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          {/* Vertical accent line */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{ 
              background: `linear-gradient(to bottom, ${agentColor}, transparent)` 
            }}
          />

          {/* Content */}
          <div className="backdrop-blur-xl bg-white/5 p-6 pl-8 max-h-[400px] overflow-y-auto">
            <pre 
              className="text-white/80 whitespace-pre-wrap"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: '1.6'
              }}
            >
              {displayContent}
            </pre>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
