import { createHash, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE = 'admin_session';
const MAX_AGE = 60 * 60 * 12; // 12 hours

/** Shared secret. Override with ADMIN_PASSWORD in .env.local. */
const password = process.env.ADMIN_PASSWORD || 'root';

/**
 * The cookie holds a hash of the password rather than the password itself,
 * so a leaked cookie does not hand over the password in plain text.
 */
function token(): string {
  return createHash('sha256').update(`cashflow:${password}`).digest('hex');
}

function equals(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  // Compare in constant time so a wrong guess cannot be timed character by character.
  return left.length === right.length && timingSafeEqual(left, right);
}

export function isPasswordCorrect(candidate: string): boolean {
  return equals(candidate, password);
}

export async function isAdminUnlocked(): Promise<boolean> {
  const cookie = (await cookies()).get(COOKIE)?.value;
  return Boolean(cookie && equals(cookie, token()));
}

/**
 * Guard for admin pages. A layout check alone is not enough: Next renders
 * layout and page in parallel, so a locked page would still fetch its data
 * and ship it in the RSC payload behind the lock screen. Every admin page
 * must call this before loading anything.
 */
export async function requireAdmin(): Promise<boolean> {
  return isAdminUnlocked();
}

/** Call from a Server Function only — Server Components cannot set cookies. */
export async function unlockAdmin(): Promise<void> {
  (await cookies()).set(COOKIE, token(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function lockAdmin(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
