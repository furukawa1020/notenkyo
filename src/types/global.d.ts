// Global type definitions for packages without types
declare module 'minimatch' {
  export default function minimatch(target: string, pattern: string, options?: any): boolean;
  export function filter(pattern: string, options?: any): (target: string) => boolean;
  export function match(list: readonly string[], pattern: string, options?: any): string[];
  export function makeRe(pattern: string, options?: any): RegExp | false;
}
