import { hash, verify, Algorithm } from "@node-rs/argon2";

/**
 * Password hashing — argon2id.
 *
 * Parameters follow the OWASP Password Storage Cheat Sheet's argon2id
 * recommendation: 19 MiB of memory, 2 iterations, 1 lane. Memory hardness is
 * what makes GPU cracking expensive, so memoryCost is the number that matters.
 *
 * @node-rs/argon2 ships prebuilt Rust binaries, so there is no node-gyp step
 * and nothing to compile in Vercel's build image.
 */
const OPTIONS = {
  algorithm: Algorithm.Argon2id,
  memoryCost: 19456, // KiB
  timeCost: 2,
  parallelism: 1,
};

/** Produces a self-describing PKC string: $argon2id$v=19$m=19456,t=2,p=1$... */
export function hashPassword(password) {
  return hash(password, OPTIONS);
}

/**
 * Verify a password against a stored hash.
 *
 * Parameters come from the stored hash itself, not from OPTIONS, so raising the
 * cost later does not invalidate existing passwords.
 */
export async function verifyPassword(storedHash, password) {
  if (!storedHash || typeof password !== "string") return false;
  try {
    return await verify(storedHash, password);
  } catch {
    // Malformed or truncated hash in the database — treat as a failed login
    // rather than a 500, but never as a success.
    return false;
  }
}

/**
 * A real argon2id hash of a value nobody knows, used to burn the same CPU time
 * on a login attempt for an address that has no account.
 *
 * Without this, "no such user" returns in ~1ms while "wrong password" takes
 * ~50ms, and that gap alone tells an attacker which addresses are registered —
 * which would defeat the generic error message the login route returns.
 */
const DUMMY_HASH =
  "$argon2id$v=19$m=19456,t=2,p=1$8HprE4/Cj95N8adKkMUmqg$1wCUBgMrdnnEWcj2oaAeJRBTy/mabn+J2NHLgEVeBxE";

export async function equalizeTiming(password) {
  await verifyPassword(DUMMY_HASH, typeof password === "string" ? password : "");
}
