// app/services/application_event_log_service.ts
import ApplicationEventLog from '#models/application_event_log'
import logger from '@adonisjs/core/services/logger'
import { createApplicationEventLogValidator } from '#validators/application_event_log_validator'
import type { CreateApplicationEventLogPayload } from '#interfaces/application_event_log_action_type_interface'

/**
 * Service to handle application event logs
 * @class ApplicationEventLogService
 */
export default class ApplicationEventLogService {
  /**
   * Create a new application event log
   * @param {CreateApplicationEventLogPayload} payload - The data to create the event log
   * @returns {Promise<ApplicationEventLog>} - A promise that resolves with the created event log
   */
  public static async createApplicationEventLog(
    payload: CreateApplicationEventLogPayload,
  ): Promise<ApplicationEventLog> {
    try {
      const validatePayload: CreateApplicationEventLogPayload =
        await createApplicationEventLogValidator.validate(payload)
      const createdApplicationEventLog: ApplicationEventLog = await ApplicationEventLog.create(validatePayload)

      const applicationEventLog: ApplicationEventLog | null = await this.getApplicationEventLogById(
        createdApplicationEventLog.id,
      )

      if (!applicationEventLog) {
        throw new Error('Application Event not found')
      }

      return applicationEventLog
    } catch (error: any) {
      logger.error('Error while creating application event log:', error)
      throw error
    }
  }

  /**
   * Get all application event logs
   * @returns {Promise<ApplicationEventLog[]>} - A promise that resolves with an array of logs
   */
  public static async getAllApplicationEventLogs(): Promise<ApplicationEventLog[]> {
    try {
      return await ApplicationEventLog.query().preload('user').preload('project').orderBy('created_at', 'desc')
    } catch (error: any) {
      logger.error('Error while fetching all application event logs:', error)
      throw error
    }
  }

  /**
   * Get application event logs by project ID
   * @param {number} projectId - The project ID
   * @returns {Promise<ApplicationEventLog[]>} - A promise that resolves with logs related to the project
   */
  public static async getApplicationEventLogsByProjectId(projectId: number): Promise<ApplicationEventLog[]> {
    try {
      return await ApplicationEventLog.query()
        .where('project_id', projectId)
        .preload('user')
        .preload('project')
        .orderBy('created_at', 'desc')
    } catch (error: any) {
      logger.error(`Error while fetching event logs for project ID ${projectId}:`, error)
      throw error
    }
  }

  /**
   * Get application event logs by user ID
   * @param {number} userId - The user ID
   * @returns {Promise<ApplicationEventLog[]>} - A promise that resolves with logs related to the user
   */
  public static async getApplicationEventLogsByUserId(userId: number): Promise<ApplicationEventLog[]> {
    try {
      return await ApplicationEventLog.query()
        .where('user_id', userId)
        .preload('user')
        .preload('project')
        .orderBy('created_at', 'desc')
    } catch (error: any) {
      logger.error(`Error while fetching event logs for user ID ${userId}:`, error)
      throw error
    }
  }

  /**
   * Get a specific application event log by ID
   * @param {number} id - The ID of the event log
   * @returns {Promise<ApplicationEventLog | null>} - A promise that resolves with the event log or null if not found
   */
  public static async getApplicationEventLogById(id: number): Promise<ApplicationEventLog | null> {
    try {
      const applicationEventLog: ApplicationEventLog | null = await ApplicationEventLog.query()
        .where('id', id)
        .preload('user')
        .preload('project')
        .first()

      if (!applicationEventLog) {
        logger.warn(`No application event log found with ID ${id}`)
        return null
      }

      return applicationEventLog
    } catch (error: any) {
      logger.error(`Error while fetching application event log with ID ${id}:`, error)
      throw error
    }
  }
}
