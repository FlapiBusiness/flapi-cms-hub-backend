import type { HttpContext } from '@adonisjs/core/http'
import TeamService from '#services/team_service'
import type Team from '#models/team'

/**
 * Controller class for managing teams
 */
export default class TeamsController {
  private readonly teamService = new TeamService()

  /**
   * Get all teams
   * @param {HttpContext} response - The HTTP response
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async getAllTeams({ response }: HttpContext): Promise<void> {
    const teams: Team[] = await this.teamService.getAllTeams()
    return response.ok(teams)
  }

  // GET /teams/:id
  /**
   * Get a team by ID
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async getTeamById({ params, response }: HttpContext): Promise<void> {
    const team: Team = await this.teamService.getTeamById(Number(params.id))
    return response.ok(team)
  }

  // POST /teams
  /**
   * Create a new team
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async create({ request, response }: HttpContext): Promise<void> {
    const data: { name: string; description: string | undefined } = request.only(['name', 'description'])
    const team: Team = await this.teamService.createTeam(data)
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
    const team: Team = await this.teamService.updateTeam(Number(params.id), data)
    return response.ok(team)
  }

  /**
   * Delete a team
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async delete({ params, response }: HttpContext): Promise<void> {
    await this.teamService.deleteTeam(Number(params.id))
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
    const { userId, role } = request.only(['userId', 'role'])
    const team: Team = await this.teamService.addUserToTeam(Number(params.id), userId, role || 'member')
    return response.ok(team)
  }

  /**
   * Remove a user from a team
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async removeUserFromTeam({ params, request, response }: HttpContext): Promise<void> {
    const { userId } = request.only(['userId'])
    const team: Team = await this.teamService.removeUserFromTeam(Number(params.id), userId)
    return response.ok(team)
  }
}
