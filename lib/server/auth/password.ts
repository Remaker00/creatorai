import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

// scrypt via node:crypto (no dependency). Parameters follow OWASP's minimum (N=2^17, r=8, p=1)
// and are stored in the hash, so they can be raised later without invalidating old hashes.
const LOG_N = 17;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;
const SALT_BYTES = 16;

function derive(password: string, salt: Buffer, logN: number, r: number, p: number): Promise<Buffer> {
  const options: ScryptOptions = { N: 2 ** logN, r, p, maxmem: 256 * 1024 * 1024 };
  return new Promise((resolve, reject) =>
    scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, options, (err, key) => (err ? reject(err) : resolve(key))),
  );
}

/** Returns `scrypt$logN$r$p$salt$hash` (base64url parts). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const key = await derive(password, salt, LOG_N, R, P);
  return ["scrypt", LOG_N, R, P, salt.toString("base64url"), key.toString("base64url")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, logN, r, p, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const actual = await derive(password, Buffer.from(salt, "base64url"), Number(logN), Number(r), Number(p));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Precomputed so logins for unknown emails take as long as real ones (no user enumeration by timing).
let dummyHash: Promise<string> | null = null;
export async function burnPasswordCheck(password: string): Promise<void> {
  dummyHash ??= hashPassword("creatorai-timing-equalizer");
  await verifyPassword(password, await dummyHash);
}
