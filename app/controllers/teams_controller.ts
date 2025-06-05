import type { HttpContext } from '@adonisjs/core/http'
import TeamService from '#services/team_service'
import type Team from '#models/team'
import type {
  CreateTeamPayload,
  UpdateTeamPayload,
  AddUserToTeamPayload,
  UpdateUserRolePayload,
} from '#interfaces/team_interface'

/**
 * Controller class for managing teams
 */
export default class TeamsController {
  /**
   * @getAllTeams
   * @operationId getAllTeams
   * @tag Teams
   * @summary Get all teams
   * @description Get all teams
   * @content application/json
   * @responseBody 200 - <Team[]>
   */
  /**
   * Get all teams
   * @param {HttpContext} response - The HTTP response
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async getAllTeams({ response }: HttpContext): Promise<void> {
    const teams: Team[] = await TeamService.getAllTeams()
    return response.ok(teams)
  }

  /**
   * @getTeamById
   * @operationId getTeamById
   * @tag Teams
   * @summary Get a team by ID
   * @description Get a team by ID
   * @paramPath id - The ID of the team - @type(number) @required
   * @content application/json
   * @responseBody 200 - <Team>
   * @responseBody 404 - <MessageResponse>
   */
  /**
   * Get a team by ID
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async getTeamById({ params, response }: HttpContext): Promise<void> {
    const team: Team = await TeamService.getTeamById(Number(params.id))
    return response.ok(team)
  }

  /**
   * @getTeamsByUserId
   * @operationId getTeamsByUserId
   * @tag Teams
   * @summary Get all teams by user ID
   * @description Get all teams by user ID
   * @paramPath user_id - The ID of the user - @type(number) @required
   * @content application/json
   * @responseBody 200 - <Team[]>
   */
  /**
   * Récupère toutes les équipes auxquelles appartient un utilisateur.
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async getTeamsByUserId({ params, response }: HttpContext): Promise<void> {
    const userId: number = Number(params.user_id)
    const teams: Team[] = await TeamService.getTeamsByUserId(userId)
    return response.ok(teams)
  }

  /**
   * @create
   * @operationId create
   * @tag Teams
   * @summary Create a team
   * @description Create a team
   * @requestBody <CreateTeamPayload>
   * @content application/json
   * @responseBody 201 - <Team>
   * @responseBody 400 - <MessageResponse>
   */
  /**
   * Create a new team
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['auth']} ctx.auth - The HTTP auth object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async create({ request, response, auth }: HttpContext): Promise<void> {
    const data: CreateTeamPayload = request.only(['name', 'description'])
    const owner_id: number = auth.user!.id
    const team: Team = await TeamService.createTeam({ ...data, owner_id })
    return response.created(team)
  }

  /**
   * @update
   * @operationId update
   * @tag Teams
   * @summary Update a team
   * @description Update a team
   * @paramPath id - The ID of the team - @type(number) @required
   * @requestBody <UpdateTeamPayload>
   * @content application/json
   * @responseBody 200 - <Team>
   * @responseBody 400 - <MessageResponse>
   */
  /**
   * Update a team
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async update({ params, request, response }: HttpContext): Promise<void> {
    const data: UpdateTeamPayload = request.only(['name', 'description'])
    const team: Team = await TeamService.updateTeam(Number(params.id), data)
    return response.ok(team)
  }

  /**
   * @delete
   * @operationId delete
   * @tag Teams
   * @summary Delete a team
   * @description Delete a team
   * @paramPath id - The ID of the team - @type(number) @required
   * @responseBody 404 - <MessageResponse>
   */
  /**
   * Delete a team
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['auth']} ctx.auth - The HTTP auth object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async delete({ params, response, auth }: HttpContext): Promise<void> {
    const currentUserId: number = auth.user!.id
    await TeamService.deleteTeam(Number(params.id), currentUserId)
    return response.noContent()
  }

  /**
   * @addUserToTeam
   * @operationId addUserToTeam
   * @tag Teams
   * @summary Add a user to a team
   * @description Add a user to a team
   * @paramPath team_id - The ID of the team - @type(number) @required
   * @requestBody <AddUserToTeamPayload>
   * @content application/json
   * @responseBody 200 - <Team>
   * @responseBody 404 - <MessageResponse>
   * @responseBody 500 - <MessageResponse>
   */
  /**
   * Add a user to a team
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async addUserToTeam({ params, request, response }: HttpContext): Promise<void> {
    const { user_id, role }: AddUserToTeamPayload = request.only(['user_id', 'role'])
    const team: Team = await TeamService.addUserToTeam(Number(params.team_id), user_id, role || 'member')
    return response.ok(team)
  }

  /**
   * @removeUserFromTeam
   * @operationId removeUserFromTeam
   * @tag Teams
   * @summary Remove a user from a team
   * @description Remove a user from a team
   * @paramPath team_id - The ID of the team - @type(number) @required
   * @paramPath user_id - The ID of the user - @type(number) @required
   * @responseBody 200 - <Team>
   * @responseBody 404 - <MessageResponse>
   * @responseBody 500 - <MessageResponse>
   */

  /**
   * Remove a user from a team
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async removeUserFromTeam({ params, response }: HttpContext): Promise<void> {
    const team: Team = await TeamService.removeUserFromTeam(Number(params.team_id), Number(params.user_id))
    return response.ok(team)
  }

  /**
   * @updateUserRole
   * @operationId updateUserRole
   * @tag Teams
   * @summary Update a user's role in a team
   * @description Update a user's role in a team
   * @paramPath team_id - The ID of the team - @type(number) @required
   * @paramPath user_id - The ID of the user - @type(number) @required
   * @requestBody <UpdateProjectPayload>
   * @content application/json
   * @responseBody 200 - <Team>
   * @responseBody 404 - <MessageResponse>
   * @responseBody 500 - <MessageResponse>
   */
  /**
   * Update a user's role in a team
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async updateUserRole({ params, request, response }: HttpContext): Promise<void> {
    const { role }: UpdateUserRolePayload = request.only(['role'])
    const team: Team = await TeamService.updateUserRole(Number(params.team_id), Number(params.user_id), role)
    return response.ok(team)
  }
}
