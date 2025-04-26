// This file is kept for backward compatibility
// The HTB writeups are now stored as static markdown files in src/content/htb
// and are imported directly in blogData.ts

import { Post } from '../types/blog';

// This function is no longer used
export const fetchHTBWriteups = async (): Promise<Post[]> => {
  console.warn('fetchHTBWriteups is deprecated. HTB writeups are now stored as static markdown files.');
  return [];
}; 