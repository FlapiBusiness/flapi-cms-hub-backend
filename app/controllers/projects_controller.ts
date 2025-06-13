import type { HttpContext } from '@adonisjs/core/http'
import { createProjectValidator, updateProjectValidator } from '#validators/project_validator'
import type { CreateProjectPayload, UpdateProjectPayload } from '#interfaces/project_interface'
import ProjectService from '#services/project_service'
import type Project from '#models/project'
import { GitHubService } from '#services/github_service'

/**
 * Controller to handle project operations
 */
export default class ProjectsController {
  /**
   * @triggerGithubWorkflow
   * @operationId triggerGithubWorkflow
   * @tag Projects
   * @summary Trigger a GitHub workflow
   * @description Trigger a GitHub workflow for a project
   * @requestBody <TriggerGithubWorkflowPayload>
   * @content application/json
   * @responseBody 200 - <TriggerGithubWorkflowResponse>
   * @responseBody 400 - <MessageResponse>
   */
  /**
   * Trigger a GitHub workflow
   * @param request
   * @param response
   * @private
   */
  public async triggerGithubWorkflow({ request, response }: HttpContext): Promise<void> {
    const { customerName }: { customerName: string } = request.only(['customerName'])
    const repoName: string = customerName.toLowerCase().replace(/[^a-z0-9-_]/g, '-')
    const repoUrl: string | null = await GitHubService.createAndTriggerWorkflow(repoName, 'flapi-cms-client-frontend', {
      customerName,
      projectName: 'application_name',
      subdomain: 'domain_name',
      categoryApp: 'categoryApp',
      longDescriptionApp: 'longDescriptionApp',
      shortDescriptionApp: 'shortDescriptionApp',
    })
    if (repoUrl) {
      return response.json({ message: 'Workflow triggered successfully', repoUrl })
    } else {
      return response.status(400).json({ message: 'Failed to trigger workflow or repository already exists' })
    }
  }

  /**
   * @create
   * @operationId createProject
   * @tag Projects
   * @summary Create a project
   * @description Create a new project
   * @requestBody <CreateProjectPayload>
   * @content application/json
   * @responseBody 201 - <CreateProjectResponse>
   * @responseBody 400 - <CreateProjectResponse>
   */
  /**
   * Handle project creation
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async create({ request, response }: HttpContext): Promise<void> {
    const payload: CreateProjectPayload = await createProjectValidator.validate(request.all())

    const createdProject: Project = await ProjectService.createProject(payload)

    // Respond with the created project
    response.status(201).json({ message: 'Project created successfully', project_id: createdProject.id })
  }

  /**
   * @getProjects
   * @operationId getProjects
   * @tag Projects
   * @summary Get all projects
   * @description Get all projects
   * @content application/json
   * @responseBody 200 - <Project[]>
   * @responseBody 400 - <MessageResponse>
   */
  /**
   * Get all projects
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   */
  public async getProjects({ response }: HttpContext): Promise<void> {
    const projects: Project[] = await ProjectService.getProjects()
    response.status(200).json(projects)
  }

  /**
   * @getProjectById
   * @operationId getProjectById
   * @tag Projects
   * @summary Get a project by ID
   * @description Get a project by ID
   * @paramPath id - The ID of the project - @type(number) @required
   * @content application/json
   * @responseBody 200 - <Project>
   * @responseBody 400 - <MessageResponse>
   */
  /**
   * Get a project by ID
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   */
  public async getProjectById({ response, params }: HttpContext): Promise<void> {
    const project: Project = await ProjectService.getProjectById(params.id)
    response.status(200).json(project)
  }

  /**
   * @getProjectByUserId
   * @operationId getProjectByUserId
   * @tag Projects
   * @summary Get a project by user ID
   * @description Get a project by user ID
   * @paramPath user_id - The ID of the user - @type(number) @required
   * @content application/json
   * @responseBody 200 - <Project[]>
   * @responseBody 400 - <MessageResponse>
   */
  /**
   * Get a project by User ID
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   */
  public async getProjectByUserId({ response, params }: HttpContext): Promise<void> {
    const projects: Project[] = await ProjectService.getProjectByUserId(params.user_id)
    response.status(200).json(projects)
  }

  /**
   * @updateProject
   * @operationId updateProject
   * @tag Projects
   * @summary Update a project
   * @description Update a project
   * @paramPath id - The ID of the project - @type(number) @required
   * @requestBody <UpdateProjectPayload>
   * @content application/json
   * @responseBody 200 - <MessageResponse>
   * @responseBody 400 - <MessageResponse>
   */
  /**
   * Update a project
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params objecta
   */
  public async updateProject({ request, response, params }: HttpContext): Promise<void> {
    const payload: UpdateProjectPayload = await updateProjectValidator.validate(request.all())
    await ProjectService.updateProject(params.id, payload)
    response.status(200).json({ message: 'Project updated successfully' })
  }

  /**
   * @deleteProject
   * @operationId deleteProject
   * @tag Projects
   * @summary Delete a project
   * @description Delete a project
   * @paramPath id - The ID of the project - @type(number) @required
   * @content application/json
   * @responseBody 200 - <MessageResponse>
   * @responseBody 400 - <MessageResponse>
   */
  /**
   * Delete a project
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   */
  public async deleteProject({ response, params }: HttpContext): Promise<void> {
    await ProjectService.deleteProject(params.id)
    response.status(200).json({ message: 'Project deleted successfully' })
  }

  /**
   * @addTeamToProject
   * @operationId addTeamToProject
   * @tag Projects
   * @summary Add a team to a project
   * @description Add a team to a project
   * @paramPath project_id - The ID of the project - @type(number) @required
   * @paramPath team_id - The ID of the team - @type(number) @required
   * @content  application/json
   * @responseBody 200 - <Project>
   * @responseBody 400 - <MessageResponse>
   * @responseBody 404 - <MessageResponse>
   */
  /**
   * Ajoute une équipe à un projet.
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async addTeamToProject({ params, response }: HttpContext): Promise<void> {
    const project: Project = await ProjectService.addTeamToProject(Number(params.project_id), Number(params.team_id))
    return response.ok(project)
  }

  /**
   * @removeTeamFromProject
   * @operationId removeTeamFromProject
   * @tag Projects
   * @summary Remove a team from a project
   * @description Remove a team from a project
   * @paramPath project_id - The ID of the project - @type(number) @required
   * @paramPath team_id - The ID of the team - @type(number) @required
   * @content  application/json
   * @responseBody 200 - <Project>
   * @responseBody 400 - <MessageResponse>
   * @responseBody 404 - <MessageResponse>
   */
  /**
   * Retire une équipe d'un projet.
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async removeTeamFromProject({ params, response }: HttpContext): Promise<void> {
    const project: Project = await ProjectService.removeTeamFromProject(
      Number(params.project_id),
      Number(params.team_id),
    )
    return response.ok(project)
  }
}
