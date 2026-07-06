import { fileURLToPath } from 'url';
import path from 'path';

/**
 * ESM-compatible __dirname equivalent.
 * Usage: const __dirname = esmDirname(import.meta.url);
 */
export function esmDirname(metaUrl: string): string {
  return path.dirname(fileURLToPath(metaUrl));
}
