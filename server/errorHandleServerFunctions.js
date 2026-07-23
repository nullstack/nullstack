import context from './context'

/**
 * Turns a thrown server-function exception into an HTTP JSON response.
 *
 * ## Throw contract
 *
 * Prefer throwing an `Error` instance (or subclass). Plain objects are tolerated
 * so the request still completes, but they skip stack-based logging details.
 *
 * ```js
 * throw new Error('unexpected failure')
 *
 * // tolerated (unusual) — must not crash the server
 * throw { status: 200, result: { code: 'UNKNOWN_ERROR', message: 'Erro Interno' } }
 *
 * class BusinessError extends Error {
 *   constructor(message, { status = 422, code } = {}) {
 *     super(message)
 *     this.status = status
 *     this.code = code
 *   }
 *   toJSON() {
 *     return { message: this.message, code: this.code }
 *   }
 * }
 * throw new BusinessError('invalid input', { code: 'INVALID' })
 * ```
 *
 * ## Customize via `context.onerror`
 *
 * ```js
 * context.onerror = (error) => ({
 *   status: error.status || 500,
 *   result: {
 *     message: error.message,
 *     code: error.code,
 *   },
 * })
 * ```
 *
 * Return shape:
 * - `{ status?, result? }` — preferred; `status` becomes the HTTP status, `result` the JSON body
 * - any other non-null value — used as body; status falls back to `error.status || 500`
 * - `null` / `undefined` — skip to the next resolution step
 *
 * Resolution order:
 * 1. `context.onerror(error)` when defined
 * 2. `error.toJSON()` when available (custom Error subclass)
 * 3. empty `{}` with status `500` (default — no leak)
 *
 * @param {import('express').Response} response
 * @param {Error & { status?: number, code?: string | number, toJSON?: () => unknown } | Record<string, unknown>} error
 * @param {{wrapResult?: boolean}} [options]
 *  - wrapResult: true for invoker routes (`{ result }`), false for exposed `_invoke` routes
 */
export default function errorHandleServerFunction(
  response,
  error,
  { wrapResult = true } = {},
) {
  let status = 500
  let result = null

  if (typeof context.onerror === 'function') {
    const handled = context.onerror(error)
    if (handled != null) {
      if (
        typeof handled === 'object' &&
        ('result' in handled || 'status' in handled)
      ) {
        status = handled.status || error?.status || 500
        result = 'result' in handled ? handled.result : handled
      } else {
        status = error?.status || 500
        result = handled
      }
    } else if (error && typeof error.toJSON === 'function') {
      result = error.toJSON()
      status = error.status || 500
    }
  } else if (error && typeof error.toJSON === 'function') {
    result = error.toJSON()
    status = error.status || 500
  }

  if (result === null) {
    return response.status(500).json({})
  }

  return response.status(status).json(wrapResult ? { result } : result)
}
