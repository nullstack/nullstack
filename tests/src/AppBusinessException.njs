export default class AppBusinessException extends Error {
  constructor(message, { status = 422, code } = {}) {
    super(message)
    this.status = status
    this.code = code
  }
  toJSON() {
    return { message: this.message, code: this.code }
  }
}