import type { AuthPermission } from '../contracts/auth.js'

export type AuditLogPayload = {
  action: string
  entityType: string
  entityId?: string
  userId: string
  timestamp: string
  metadata?: Record<string, unknown>
  before?: unknown
  after?: unknown
}

/**
 * AdminAuditService handles recording administrative actions for security and tracking.
 * 
 * In this phase, it serves as a hardened scaffold for future implementation.
 * No actual database writes occur yet, but it enforces safe payload formatting.
 */
export class AdminAuditService {
  /**
   * Records an administrative action.
   * 
   * @param payload The audit log details.
   * @returns A promise that resolves when the audit log is recorded.
   */
  async logAction(payload: AuditLogPayload): Promise<void> {
    // Validate payload doesn't contain sensitive data before "logging"
    this.sanitizePayload(payload)

    // This is a scaffold. In a future phase, this will write to the audit_logs table.
    // console.log('[Audit Log Scaffold]', payload)
    return Promise.resolve()
  }

  /**
   * Helper to format metadata for common actions safely.
   */
  formatMetadata(request: { ip: string, userAgent?: string }): Record<string, unknown> {
    return {
      ip: request.ip,
      userAgent: request.userAgent || 'unknown',
    }
  }

  /**
   * Ensures sensitive data like passwords or session tokens are not logged.
   */
  private sanitizePayload(payload: AuditLogPayload): void {
    const sensitiveKeys = ['password', 'token', 'secret', 'hash', 'cookie', 'csrf']
    
    const sanitize = (obj: unknown) => {
      if (!obj || typeof obj !== 'object') return
      
      const record = obj as Record<string, unknown>
      for (const key of Object.keys(record)) {
        if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
          record[key] = '[REDACTED]'
        } else if (typeof record[key] === 'object') {
          sanitize(record[key])
        }
      }
    }

    sanitize(payload.metadata)
    sanitize(payload.before)
    sanitize(payload.after)
  }
}

export const adminAuditService = new AdminAuditService()
