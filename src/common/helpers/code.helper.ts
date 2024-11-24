import * as crypto from 'crypto';

export function generateOneTimeCode(): { code: string; expiresAt: Date } {
  const code = crypto.randomBytes(4).toString('hex'); // Generate a random 4-byte code
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10); // The code is valid for 10 minutes
  return { code, expiresAt };
}
