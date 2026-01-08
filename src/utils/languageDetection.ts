// Simple language detection based on code patterns
export function detectLanguage(code: string): string {
  if (!code || code.trim().length === 0) {
    return 'text';
  }

  const trimmed = code.trim();

  // Python indicators (check first for specificity)
  if (
    trimmed.includes('def ') ||
    (trimmed.includes('import ') && !trimmed.includes('from ')) ||
    trimmed.includes('print(') ||
    trimmed.includes('if __name__') ||
    trimmed.match(/^\s*#.*python/i) ||
    trimmed.includes('lambda ') ||
    trimmed.includes('with ') ||
    trimmed.includes('async def') ||
    trimmed.includes('elif ') ||
    trimmed.includes('except ') ||
    trimmed.includes('try:')
  ) {
    return 'python';
  }

  // JavaScript/TypeScript indicators
  if (
    trimmed.includes('function ') ||
    trimmed.includes('const ') ||
    trimmed.includes('let ') ||
    trimmed.includes('var ') ||
    trimmed.includes('console.log') ||
    trimmed.includes('=>') ||
    trimmed.includes('export ') ||
    (trimmed.includes('import ') && trimmed.includes('from '))
  ) {
    // Try to distinguish TypeScript
    if (
      trimmed.includes(': string') ||
      trimmed.includes(': number') ||
      trimmed.includes(': boolean') ||
      trimmed.includes('interface ') ||
      trimmed.includes('type ') ||
      trimmed.includes('enum ')
    ) {
      return 'typescript';
    }
    return 'javascript';
  }

  // Java indicators
  if (
    trimmed.includes('public class') ||
    trimmed.includes('private ') ||
    trimmed.includes('public static void main') ||
    trimmed.includes('System.out.println')
  ) {
    return 'java';
  }

  // C/C++ indicators
  if (
    trimmed.includes('#include') ||
    trimmed.includes('int main(') ||
    trimmed.includes('printf(') ||
    trimmed.includes('std::') ||
    trimmed.includes('using namespace')
  ) {
    return trimmed.includes('std::') || trimmed.includes('using namespace') ? 'cpp' : 'c';
  }

  // Go indicators
  if (
    trimmed.includes('package ') ||
    trimmed.includes('func ') ||
    trimmed.includes('import (') ||
    trimmed.includes('fmt.Println')
  ) {
    return 'go';
  }

  // Rust indicators
  if (
    trimmed.includes('fn ') ||
    trimmed.includes('let mut ') ||
    trimmed.includes('println!') ||
    trimmed.includes('use ')
  ) {
    return 'rust';
  }

  // HTML indicators
  if (
    trimmed.includes('<!DOCTYPE') ||
    trimmed.includes('<html') ||
    trimmed.includes('<div') ||
    trimmed.includes('<body')
  ) {
    return 'html';
  }

  // CSS indicators
  if (
    trimmed.includes('{') && trimmed.includes('}') &&
    (trimmed.includes(':') || trimmed.includes('@media') || trimmed.includes('@keyframes'))
  ) {
    return 'css';
  }

  // SQL indicators
  if (
    trimmed.match(/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\s+/i) ||
    trimmed.includes('FROM ') ||
    trimmed.includes('WHERE ')
  ) {
    return 'sql';
  }

  // Default to text if no patterns match
  return 'text';
}

