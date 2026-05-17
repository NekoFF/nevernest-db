import bcrypt from 'bcryptjs'

export const PASSWORD_HASH_ALGORITHM = 'bcryptjs'
export const PASSWORD_HASH_COST = 12

export function validateLocalAdminPassword(password: string): string[] {
  const issues: string[] = []
  if (password.length < 14) issues.push('Password must be at least 14 characters long.')
  if (!/[a-z]/.test(password)) issues.push('Password must include a lowercase letter.')
  if (!/[A-Z]/.test(password)) issues.push('Password must include an uppercase letter.')
  if (!/[0-9]/.test(password)) issues.push('Password must include a number.')
  if (!/[^A-Za-z0-9]/.test(password)) issues.push('Password must include a symbol.')
  return issues
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, PASSWORD_HASH_COST)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
