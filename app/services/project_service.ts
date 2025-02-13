import type { ProjectPayload, UpdateProjectPayload } from '#validators/project_validator'
import logger from '@adonisjs/core/services/logger'
import MailService from '#services/mail_service'
import env from '#start/env'
import Project from '#models/project'
import User from '#models/user'
import Database from '#models/database'
import Team from '#models/team'

/**
 * Service to handle project operations
 * @class ProjectService
 */
export default class ProjectService {
  /**
   * Create a new project
   * @param {ProjectPayload} payload - Data to create the project
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public static async createProject(payload: ProjectPayload): Promise<Project> {
    try {
      // Create the project
      const project: Project = await Project.create({
        application_name: payload.application_name,
        user_id: payload.user_id,
        domain_name: payload.domain_name,
        file_id: payload.file_id,
        database_id: payload.database_id,
      })
      const user: User = await User.findByOrFail('id', payload.user_id)

      const db: Database | null = await Database.findBy('id', payload.database_id)
      await MailService.sendEmail(user.email, 'project-created', 'Project Created', {
        username: user.firstname + ' ' + user.lastname,
        appName: payload.application_name,
        domainName: payload.domain_name,
        databaseName: db?.name,
        redirect_uri:
          env.get('FRONTEND_APP_BASE_URL') + env.get('FRONTEND_APP_REDIRECT_URI_ACCOUNT_VALIDATE') + user.email,
      })
      return project
    } catch (error: any) {
      logger.error(error)
      throw error
    }
  }

  /**
   * Get all projects
   * @returns {Promise<Project[]>} - A promise that resolves with an array of projects
   */
  public static async getProjects(): Promise<Project[]> {
    try {
      return await Project.all()
    } catch (error: any) {
      logger.error(error)
      throw error
    }
  }

  /**
   * Get a project by ID
   * @param {number} id - The project ID
   * @returns {Promise<Project>} - A promise that resolves with a project or null
   */
  public static async getProjectById(id: number): Promise<Project> {
    try {
      return await Project.query().where('id', id).preload('teams').firstOrFail()
    } catch (error: any) {
      logger.error(error)
      throw error
    }
  }

  /**
   * Get a project by user ID
   * @param {number} userId - The user ID
   * @returns {Promise<Project>} - A promise that resolves with a project or null
   */
  public static async getProjectByUserId(userId: number): Promise<Project[]> {
    try {
      return await Project.findManyBy('user_id', userId)
    } catch (error: any) {
      logger.error(error)
      throw error
    }
  }

  /**
   * Update a project
   * @param {number} projectId - The project ID
   * @param {UpdateProjectPayload} payload - The data to update the project
   */
  public static async updateProject(projectId: number, payload: UpdateProjectPayload): Promise<void> {
    try {
      const project: Project = await ProjectService.getProjectById(projectId)

      await project
        .merge({
          application_name: payload.application_name,
          user_id: payload.user_id,
          domain_name: payload.domain_name,
          file_id: payload.file_id,
          database_id: payload.database_id,
        })
        .save()
      await project.refresh()

      const user: User = await User.findByOrFail('id', project.user_id)

      const db: Database = await Database.findByOrFail('id', project.database_id)
      await MailService.sendEmail(user.email, 'project-updated', 'Project Updated', {
        username: user.firstname + ' ' + user.lastname,
        appName: payload.application_name,
        domainName: payload.domain_name,
        databaseName: db.name,
        redirect_uri:
          env.get('FRONTEND_APP_BASE_URL') + env.get('FRONTEND_APP_REDIRECT_URI_ACCOUNT_VALIDATE') + user.email,
      })
    } catch (error: any) {
      logger.error(error)
      throw error
    }
  }

  /**
   * Delete a project
   * @param {number} projectId - The project ID
   */
  public static async deleteProject(projectId: number): Promise<void> {
    try {
      const project: Project = await ProjectService.getProjectById(projectId)
      await project.delete()
    } catch (error: any) {
      logger.error(error)
      throw error
    }
  }

  /**
   * Ajoute une équipe à un projet.
   * @param {number} projectId - L'ID du projet
   * @param {number} teamId - L'ID de l'équipe à ajouter
   * @returns {Promise<Project>} Le projet mis à jour
   */
  public static async addTeamToProject(projectId: number, teamId: number): Promise<Project> {
    const project: Project = await Project.findOrFail(projectId)
    await Team.findOrFail(teamId)
    await project.related('teams').attach([teamId])
    return project
  }

  /**
   * Retire une équipe d'un projet.
   * @param {number} projectId - L'ID du projet
   * @param {number} teamId - L'ID de l'équipe à retirer
   * @returns {Promise<Project>} Le projet mis à jour
   */
  public static async removeTeamFromProject(projectId: number, teamId: number): Promise<Project> {
    const project: Project = await Project.findOrFail(projectId)
    await project.related('teams').detach([teamId])
    return project
  }
}
