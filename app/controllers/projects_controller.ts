import type { HttpContext } from '@adonisjs/core/http'
import { createProjectValidator, updateProjectValidator } from '#validators/project_validator'
import type { ProjectPayload, UpdateProjectPayload } from '#validators/project_validator'
import ProjectService from '#services/project_service'
import type Project from '#models/project'

/**
 * Controller to handle project operations
 */
export default class ProjectsController {
  /**
   * Handle project creation
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async create({ request, response }: HttpContext): Promise<void> {
    const payload: ProjectPayload = await createProjectValidator.validate(request.all())

    await ProjectService.createProject(payload)

    // Respond with the created project
    response.status(201).json({ message: 'Project created successfully' })
  }

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
   * Get a project by ID
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   */
  public async getProject({ response, params }: HttpContext): Promise<void> {
    const project: Project = await ProjectService.getProjectById(params.id)
    response.status(200).json(project)
  }

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
   * Delete a project
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @param {HttpContext['params']} ctx.params - The HTTP params object
   */
  public async deleteProject({ response, params }: HttpContext): Promise<void> {
    await ProjectService.deleteProject(params.id)
    response.status(200).json({ message: 'Project deleted successfully' })
  }
}
