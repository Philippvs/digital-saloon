import { createHash } from 'node:crypto'

export function hashManagementToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
