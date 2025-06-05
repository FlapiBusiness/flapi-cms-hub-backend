import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#models/user'
import KeycloakAdminService from '#services/keycloack_admin_service'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'
  async handle(ctx: HttpContext, next: NextFn): Promise<void> {
    const { request, response } = ctx

    const token: string | undefined = request.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return response.unauthorized({ error: 'Token manquant' })
    }

    try {
      const user: User | null = await KeycloakAdminService.getAuthenticatedUser(token)

      if (!user) {
        return response.unauthorized({ error: 'Utilisateur non trouvé ou token invalide' })
      }

      ctx.userAuthenticated = user

      await next()
    } catch (error) {
      console.error('Erreur middleware Auth:', error)
      return response.unauthorized({ error: "Erreur lors de l'authentification" })
    }
  }
}
