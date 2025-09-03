import type User from '#models/user'

declare module '@adonisjs/core/http' {
  /**
   * HttpContext interface extends the default AdonisJS HttpContext
   */
  interface HttpContext {
    userAuthenticated: User
  }
}
