import type { HttpContext } from '@adonisjs/core/http'
import ApplicationEventLogService from '#services/application_event_log_service'
import type ApplicationEventLog from '#models/application_event_log'
import type { CreateApplicationEventLogPayload } from '#interfaces/application_event_log_action_type_interface'
import { createApplicationEventLogValidator } from '#validators/application_event_log_validator'

/**
 * Controller to handle application event log operations
 */
export default class ApplicationEventLogsController {
  /**
   * @createApplicationEventLog
   * @operationId createApplicationEventLog
   * @tag ApplicationEventLogs
   * @summary Create an application event log
   * @description Create a new application event log
   * @requestBody <CreateApplicationEventLogPayload>
   * @content application/json
   * @responseBody 201 - <MessageResponse>
   * @responseBody 400 - <MessageResponse>
   */
  public async createApplicationEventLog({ request, response }: HttpContext): Promise<void> {
    const payload: CreateApplicationEventLogPayload = await createApplicationEventLogValidator.validate(request.all())

    await ApplicationEventLogService.createApplicationEventLog(payload)

    response.status(201).json({ message: 'Application event log created successfully' })
  }

  /**
   * @getAllApplicationEventLogs
   * @operationId getAllApplicationEventLogs
   * @tag ApplicationEventLogs
   * @summary Get all application event logs
   * @description Get all application event logs
   * @content application/json
   * @responseBody 200 - <ApplicationEventLog[]>
   */
  public async getAllApplicationEventLogs({ response }: HttpContext): Promise<void> {
    const logs: ApplicationEventLog[] = await ApplicationEventLogService.getAllApplicationEventLogs()
    response.status(200).json(logs)
  }

  /**
   * @getApplicationEventLogsByUserId
   * @operationId getApplicationEventLogsByUserId
   * @tag ApplicationEventLogs
   * @summary Get application event logs by user ID
   * @description Get application event logs by user ID
   * @paramPath user_id - The ID of the user - @type(number) @required
   * @content application/json
   * @responseBody 200 - <ApplicationEventLog[]>
   */
  public async getApplicationEventLogsByUserId({ params, response }: HttpContext): Promise<void> {
    const logs: ApplicationEventLog[] = await ApplicationEventLogService.getApplicationEventLogsByUserId(
      Number(params.user_id),
    )
    response.status(200).json(logs)
  }

  /**
   * @getApplicationEventLogsByProjectId
   * @operationId getApplicationEventLogsByProjectId
   * @tag ApplicationEventLogs
   * @summary Get application event logs by project ID
   * @description Get application event logs by project ID
   * @paramPath project_id - The ID of the project - @type(number) @required
   * @content application/json
   * @responseBody 200 - <ApplicationEventLog[]>
   */
  public async getApplicationEventLogsByProjectId({ params, response }: HttpContext): Promise<void> {
    const logs: ApplicationEventLog[] = await ApplicationEventLogService.getApplicationEventLogsByProjectId(
      Number(params.project_id),
    )
    response.status(200).json(logs)
  }
}
