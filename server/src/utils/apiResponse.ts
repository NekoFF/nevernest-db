export type ApiMeta = Record<string, unknown>

export function ok<T>(data: T, meta: ApiMeta = {}) {
  return {
    ok: true,
    data,
    meta,
  }
}

export function notImplemented(message = 'Database-backed endpoint planned for a later phase.') {
  return {
    ok: false,
    status: 'not_implemented',
    message,
  }
}

export function unauthorized(message = 'Authentication required.') {
  return {
    ok: false,
    status: 'unauthorized',
    statusCode: 401,
    message,
  }
}

export function forbidden(message = 'Permission required.') {
  return {
    ok: false,
    status: 'forbidden',
    statusCode: 403,
    message,
  }
}

export function error(message: string, statusCode = 500) {
  return {
    ok: false,
    statusCode,
    error: message,
  }
}
