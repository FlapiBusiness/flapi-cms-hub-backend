// app/Controllers/Http/UsersController.ts
import type { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'
import type User from '#models/user'
import type { UpdateUserPayload } from '#interfaces/user_interface'
import { UpdateUserValidator } from '#validators/update_user_validator'

/**
 * Controller to handle user operations
 */
export default class UsersController {
  /**
   * @getAllUsers
   * @operationId getAllUsers
   * @tag Users
   * @summary Get all users
   * @description Get all users
   * @content application/json
   * @responseBody 200 - <User[]>
   * @responseBody 400 - <MessageResponse>
   */
  /**
   * Get all users
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   */
  public async getAllUsers({ response }: HttpContext): Promise<void> {
    const users: User[] = await UserService.getAllUsers()
    response.status(200).json(users)
  }

  /**
   * @getUserById
   * @operationId getUserById
   * @tag User
   * @summary Get user by ID
   * @description Get user by ID
   * @paramPath id - The ID of the user - @type(number) @required
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
   * @summary Update User
   * @description Update User
   * @paramPath id - The ID of the user - @type(number) @required
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
   * @summary Delete user
   * @description Delete user
   * @pathParam id - The ID of the user - @type(number) @required
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
