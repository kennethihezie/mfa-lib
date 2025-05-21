import { authenticator, generateBackupCodes, validateBackupCode } from '../src/index'
import { createHash } from "crypto";


describe('generateBackupCodes', () => {
    it('should generate 10 backup codes by default', () => {
        const { backupCodes, hashedCodes } = generateBackupCodes();
        expect(backupCodes).toHaveLength(10);
        expect(hashedCodes).toHaveLength(10);
    });

    it('should generate the specified number of backup codes', () => {
        const { backupCodes, hashedCodes } = generateBackupCodes(5);
        expect(backupCodes).toHaveLength(5);
        expect(hashedCodes).toHaveLength(5);
    });

    it('should generate unique hex codes', () => {
        const { backupCodes } = generateBackupCodes(20);
        const uniqueCodes = new Set(backupCodes);
        expect(uniqueCodes.size).toBe(20);
        backupCodes.forEach(code => {
            expect(code).toMatch(/^[a-f0-9]{8}$/i);
        });
    });

    it('should hash codes correctly', () => {
        const { backupCodes, hashedCodes } = generateBackupCodes(3);
        backupCodes.forEach((code, idx) => {
            const expectedHash = createHash('sha256').update(code).digest('hex');
            expect(hashedCodes[idx]).toBe(expectedHash);
        });
    });
});

describe('validateBackupCode', () => {
    it('should validate a correct backup code and remove it from the list', () => {
        const { backupCodes, hashedCodes } = generateBackupCodes(3);
        const inputCode = backupCodes[1];
        const result = validateBackupCode(hashedCodes, inputCode);
        expect(result.status).toBe(true);
        expect(result.backupCodes).toHaveLength(2);
        // The used code's hash should not be present anymore
        const usedHash = createHash('sha256').update(inputCode).digest('hex');
        expect(result.backupCodes).not.toContain(usedHash);
    });

    it('should return false for an invalid backup code', () => {
        const { hashedCodes } = generateBackupCodes(3);
        const result = validateBackupCode(hashedCodes, 'invalidcode');
        expect(result.status).toBe(false);
        expect(result.backupCodes).toBeUndefined();
    });

    it('should not validate the same code twice', () => {
        const { backupCodes, hashedCodes } = generateBackupCodes(2);
        const inputCode = backupCodes[0];
        const first = validateBackupCode(hashedCodes, inputCode);
        expect(first.status).toBe(true);
        const second = validateBackupCode(first.backupCodes!, inputCode);
        expect(second.status).toBe(false);
    });
});

describe('authenticator export', () => {
    it('should export authenticator from otplib', () => {
        expect(authenticator).toBeDefined();
        expect(typeof authenticator.generate).toBe('function');
    });
});