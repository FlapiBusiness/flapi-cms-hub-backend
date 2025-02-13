import type { HttpContext } from '@adonisjs/core/http'
import TeamService from '#services/team_service'
import type Team from '#models/team'

/**
 * Controller class for managing teams
 */
export default class TeamsController {
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
   * Create a new team
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['auth']} ctx.auth - The HTTP auth object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async create({ request, response, auth }: HttpContext): Promise<void> {
    const data: { name: string; description?: string } = request.only(['name', 'description'])
    const owner_id: number = auth.user!.id
    const team: Team = await TeamService.createTeam({ ...data, owner_id })
    return response.created(team)
  }

  /**
   * Update a team
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async update({ params, request, response }: HttpContext): Promise<void> {
    const data: { name: string; description: string } = request.only(['name', 'description'])
    const team: Team = await TeamService.updateTeam(Number(params.id), data)
    return response.ok(team)
  }

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
   * Add a user to a team
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async addUserToTeam({ params, request, response }: HttpContext): Promise<void> {
    const { user_id, role } = request.only(['user_id', 'role'])
    const team: Team = await TeamService.addUserToTeam(Number(params.team_id), user_id, role || 'member')
    return response.ok(team)
  }

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
   * Update a user's role in a team
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async updateUserRole({ params, request, response }: HttpContext): Promise<void> {
    const { role } = request.only(['role'])
    const team: Team = await TeamService.updateUserRole(Number(params.team_id), Number(params.user_id), role)
    return response.ok(team)
  }
}
