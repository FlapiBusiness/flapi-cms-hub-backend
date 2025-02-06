import type { ProjectPayload } from '#validators/project_validator'
import logger from '@adonisjs/core/services/logger'
import MailService from '#services/mail_service'
import env from '#start/env'
import Project from '#models/project'
import User from '#models/user'
import Database from '#models/database'

/**
 * Service to handle project operations
 * @class ProjectService
 */
export default class ProjectService {
  /**
   * @param {ProjectPayload} payload - Data to create the project
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public static async createProject(payload: ProjectPayload): Promise<void> {
    try {
      // Create the project
      await Project.create({
        applicationName: payload.application_name,
        userId: payload.user_id,
        domainName: payload.domain_name,
        fileId: payload.file_id,
        databaseId: payload.database_id,
      })
      const user: User | null = await User.findBy('id', payload.user_id)
      if (!user) {
        throw new Error('User not found')
      }
      const db: Database | null = await Database.findBy('id', payload.database_id)
      await MailService.sendEmail(user.email, 'project-created', 'Project Created', {
        username: user.firstname + ' ' + user.lastname,
        appName: payload.application_name,
        domainName: payload.domain_name,
        databaseName: db?.name,
        redirect_uri:
          env.get('FRONTEND_APP_BASE_URL') + env.get('FRONTEND_APP_REDIRECT_URI_ACCOUNT_VALIDATE') + user.email,
      })
    } catch (error: any) {
      logger.error(error)
      throw error
    }
  }
}
