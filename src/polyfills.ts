// Minimal Node polyfills for browser build
// Some TON / crypto dependencies expect Buffer to exist.

import { Buffer } from 'buffer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g: any = globalThis as any;

if (!g.Buffer) {
  g.Buffer = Buffer;
}

// Optional: some libs check for global/process
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!g.global) {
  g.global = g;
}
