import { createHash, randomBytes } from "crypto";
import { authenticator } from "otplib";
import { BackupCode, UpdatedBackupCode } from "./types";

export { authenticator }

/**
 * Generates a set of backup codes and their hashed counterparts.
 *
 * @param count - Number of backup codes to generate (default is 10)
 * @returns An object containing the plaintext `backupCodes` and their `hashedCodes`
 *
 * @example
 * const { backupCodes, hashedCodes } = generateBackupCodes(5);
 */
export function generateBackupCodes(count = 10): BackupCode {
  const backupCodes = Array.from({ length: count }, () => {
    const code = randomBytes(4).toString('hex');
    return code;
  });

  const hashedCodes = backupCodes.map((code) => hashCode(code));

  return { backupCodes, hashedCodes };
}

/**
 * Validates a user's backup code against a list of hashed backup codes.
 *
 * @param hashCodes - Array of hashed backup codes to validate against
 * @param inputCode - Plaintext code input by the user
 * @returns An object indicating whether the code is valid and, if so,
 *          the updated array of remaining hashed codes
 * 
 *
 * @example
 * const { status, backupCodes } = validateBackupCode(hashedCodes, userInputCode);
 */
export function validateBackupCode(hashCodes: string[], inputCode: string): UpdatedBackupCode {
  const hashedInput = hashCode(inputCode);

  if (hashCodes.includes(hashedInput)) {
    const remaining = hashCodes.filter((c) => c !== hashedInput);
    return { status: true, backupCodes: remaining };
  }

  return { status: false };
}

/**
 * Hashes a backup code using SHA-256.
 *
 * @param code - The backup code to hash
 * @returns The SHA-256 hashed string of the code
 */
function hashCode(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}