# mfa-lib

> Lightweight, secure MFA (TOTP) + backup codes utility for Node.js / NestJS apps.

[![NPM version](https://img.shields.io/npm/v/@your-org/nestjs-mfa.svg)](https://www.npmjs.com/package/@your-org/nestjs-mfa)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## ✨ Features

- 🔐 Time-based One-Time Password (TOTP)
- 📱 Works with Google Authenticator, Microsoft Authenticator, Authy, etc.
- 🔁 Backup codes generation and validation
- 🔒 SHA-256 hashing for secure storage
- 🧩 Minimal dependencies and TypeScript support

---

## 📦 Installation

```bash
npm install mfa-lib
```

or

```bash
yarn add mfa-lib
```

---

## 🚀 Usage

### Generate MFA Secret and OTP

```ts
import { authenticator } from 'mfa-lib';

const secret = authenticator.generateSecret();
const token = authenticator.generate(secret);

const isValid = authenticator.check(token, secret); // true or false
```

### Generate Backup Codes

```ts
import { generateBackupCodes } from 'mfa-lib';

const { backupCodes, hashedCodes } = generateBackupCodes(5);
// Store hashedCodes in your database; backupCodes can be shown once to the user
```

### Validate a Backup Code

```ts
import { validateBackupCode } from 'mfa-lib';

const result = validateBackupCode(hashedCodes, inputCode);
if (result.status) {
  // code is valid
  // result.backupCodes contains remaining valid codes (after removing the used one)
} else {
  // invalid code
}
```

---

## 📘 API

### `generateBackupCodes(count?: number): BackupCode`

Generates a set of backup codes and their hashed equivalents.

- `count`: Number of backup codes (default = 10)
- Returns: `{ backupCodes: string[], hashedCodes: string[] }`

### `validateBackupCode(hashedCodes: string[], inputCode: string): UpdatedBackupCode`

Validates a backup code against the list of stored (hashed) codes.

- Returns: `{ status: boolean, backupCodes?: string[] }`

---

## 🛡️ Security Notes

- Always **store only hashed** versions of backup codes
- Treat backup codes as **one-time use**
- Securely store the TOTP secret (e.g., in a secret manager)
- Regenerate codes if compromised

---

## 🔧 Types

```ts
interface BackupCode {
  backupCodes: string[];
  hashedCodes: string[];
}

interface UpdatedBackupCode {
  status: boolean;
  backupCodes?: string[];
}
```

---

## 📄 License

MIT © 2025 Collins Ihezie

---

---

## Author
  
[@Collins](https://github.com/kennethihezie)

---

## 🙌 Contributions

Issues and PRs welcome! [Submit here](https://github.com/kennethihezie/mfa-lib/issues).
