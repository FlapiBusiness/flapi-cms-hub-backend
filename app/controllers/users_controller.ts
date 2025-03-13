// app/Controllers/Http/UsersController.ts
import type { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'
import type User from '#models/user'
import type { UpdateUserPayload } from '#validators/update_user_validator'
import { UpdateUserValidator } from '#validators/update_user_validator'

/**
 *
 */
export default class UsersController {
  /**
   * Récupère tous les utilisateurs.
   */
  public async getAllUsers({ response }: HttpContext): Promise<void> {
    const users: User[] = await UserService.getAllUsers()
    return response.ok(users)
  }

  /**
   * Récupère un utilisateur par son ID.
   */
  public async getUserById({ params, response }: HttpContext): Promise<void> {
    const user: User = await UserService.getUserById(Number(params.id))
    return response.ok(user)
  }

  /**
   * Récupère les utilisateurs associés à un projet.
   */
  /*public async getUsersByProjectId({ params, response }: HttpContext): Promise<void> {
        const users: User[] = await UserService.getUsersByProjectId(Number(params.project_id))
        return response.ok(users)
    }*/

  /**
   * Met à jour un utilisateur.
   * Valide la requête avant d'envoyer les données au service.
   */
  public async updateUser({ params, request, response }: HttpContext): Promise<void> {
    const data: UpdateUserPayload = await UpdateUserValidator.validate(request.all())
    const user: User = await UserService.updateUser(Number(params.id), data)
    return response.ok(user)
  }

  /**
   * Supprime un utilisateur.
   */
  public async deleteUser({ params, response }: HttpContext): Promise<void> {
    await UserService.deleteUser(Number(params.id))
    return response.noContent()
  }
}
