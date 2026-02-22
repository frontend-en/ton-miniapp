// Minimal Node polyfills for browser build
// Some TON / crypto dependencies expect Buffer to exist.

import { Buffer } from 'buffer';

const g = globalThis as typeof globalThis & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Buffer?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global?: any;
};

if (!g.Buffer) {
  g.Buffer = Buffer;
}

// Optional: some libs check for global
if (!g.global) {
  g.global = g;
}
