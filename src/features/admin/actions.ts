'use server';

import { revalidatePath } from 'next/cache';

import { isPasswordCorrect, lockAdmin, unlockAdmin } from './auth';

export type UnlockState = { error: string | null };

export async function unlock(_prev: UnlockState, formData: FormData): Promise<UnlockState> {
  const password = String(formData.get('password') ?? '');

  if (!isPasswordCorrect(password)) {
    return { error: 'Wrong password.' };
  }

  await unlockAdmin();
  revalidatePath('/admin');
  return { error: null };
}

export async function lock(): Promise<void> {
  await lockAdmin();
  revalidatePath('/admin');
}
