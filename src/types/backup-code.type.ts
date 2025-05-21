export type BackupCode = {
    backupCodes: string[],
    hashedCodes: string[]
}

export type UpdatedBackupCode = {
    status: boolean,
    backupCodes?: string[]
}