import User from '#models/user'
import type { SignUpPayload } from '#interfaces/auth_interface'
import logger from '@adonisjs/core/services/logger'
import KeycloakAdminService from '#services/keycloack_admin_service'
import UserRole from '#models/user_role'
import { UserRoles } from '#enums/user_roles'
import AuthEvent from '#events/signup_event'

/**
 * Service to handle user sign up operations
 * @class AuthService
 */
export default class AuthService {
  /**
   * Validate and create a new user
   * @param {SignUpPayload} data - Data to create the user
   * @returns {Promise<User>} - The created user instance
   */
  public static async signUp(data: SignUpPayload): Promise<void> {
    try {
      /**
       * Créer un nouvel utilisateur dans Keycloak.
       * Également, ajouter le rôle par défaut ADMIN_CLIENT pour les nouveaux utilisateurs dans Keycloak.
       */
      const keycloakUserId: string = await KeycloakAdminService.createUser(
        data.email,
        data.password,
        data.firstname,
        data.lastname,
      )
      // TODO: Voir côté keycloak pour ajouter le rôle ADMIN_CLIENT avant
      //await KeycloakAdminService.addUserRole(keycloakUserId, UserRoles.ADMIN_CLIENT)

      /**
       * Si l'utilisateur est créé avec succès dans Keycloak, on peut alors créer l'utilisateur dans la base de données.
       * On utilise le rôle par défaut ADMIN_CLIENT pour les nouveaux utilisateurs,
       * qui sont des entreprises qui utilisent Flapi pour gérer leurs clients.
       */
      const defaultRole: UserRole = await UserRole.findByOrFail('name', UserRoles.ADMIN_CLIENT)

      /**
       * Créer un nouvel utilisateur dans la base de données de Flapi.
       */
      const user: User = await User.create({
        role_id: defaultRole.id,
        keycloak_user_id: keycloakUserId,
        lastname: data.lastname,
        firstname: data.firstname,
        email: data.email,
      })

      await AuthEvent.dispatch(user)

      /**
       * Authentifier l'admin Keycloak après inscription d'un nouvel utilisateur.
       */
      // return await KeycloakAdminService.getTokenForUser(data.email, data.password)
    } catch (error: any) {
      logger.error(error)
      throw error
    }
  }
}
