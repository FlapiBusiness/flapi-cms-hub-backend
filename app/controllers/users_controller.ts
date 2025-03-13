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
   * @getAllUsers
   * @operationId getAllUsers
   * @tag User
   * @summary Récupérer tous les utilisateurs
   * @description Récupérer tous les utilisateurs
   * @content application/json
   * @responseBody 200 - <User>[]
   * @responseBody 401 - <MessageResponse>
   */
  /**
   * Récupère tous les utilisateurs.
   */
  public async getAllUsers({ response }: HttpContext): Promise<void> {
    const users: User[] = await UserService.getAllUsers()
    return response.ok(users)
  }

  /**
   * @getUserById
   * @operationId getUserById
   * @tag User
   * @summary recuperer un utilisateur par son ID
   * @description recuperer un utilisateur par son ID
   * @pathParam userId - ID de l'utilisateur
   * @content application/json
   * @responseBody 200 - <User>
   * @responseBody 401 - <MessageResponse>
   */
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
   * @updateUser
   * @operationId updateUser
   * @tag User
   * @summary Mettre à jour un utilisateur
   * @description Mettre à jour un utilisateur
   * @pathParam userId - ID de l'utilisateur
   * @requestBody <UpdateUserPayload>
   * @content application/json
   * @responseBody 200 - <User>
   * @responseBody 401 - <MessageResponse>
   */
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
   * @deleteUser
   * @operationId deleteUser
   * @tag User
   * @summary Supprimer un utilisateur
   * @description Supprimer un utilisateur
   * @pathParam userId - ID de l'utilisateur
   * @responseBody 204 - <MessageResponse>
   * @responseBody 401 - <MessageResponse>
   */
  /**
   * Supprime un utilisateur.
   */
  public async deleteUser({ params, response }: HttpContext): Promise<void> {
    await UserService.deleteUser(Number(params.id))
    return response.noContent()
  }
}
