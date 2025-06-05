import NatsService from '#services/nats_service'
import ApplicationEventLogService from '#services/application_event_log_service'
import type ApplicationEventLog from '#models/application_event_log'
import type User from '#models/user'
import type { ApplicationEventLogActionType } from '#enums/application_event_log_action_type'

/**
 * Payload to send to NATS event
 * @interface ApplicationEventLogListenerPayload
 * @property {User} user - The user instance
 * @property {ApplicationEventLogActionType} action_type - The action type
 * @property {string} message - The message to send
 * @property {number} [project_id] - The project id
 * @description This interface is used to send logs to NATS
 */
export type ApplicationEventLogListenerPayload = {
  user: User
  action_type: ApplicationEventLogActionType
  message: string
  project_id?: number
}

/**
 * Listener to send logs to NATS
 * @class ApplicationEventLogListener
 */
export default class ApplicationEventLogListener {
  /**
   * Handle the event and send logs to NATS
   * @param {ApplicationEventLogListenerPayload} event - The event payload
   * @returns {Promise<void>} - A promise that resolves when the log is sent
   */
  public async handle(event: ApplicationEventLogListenerPayload): Promise<void> {
    const applicationEventLog: ApplicationEventLog = await ApplicationEventLogService.createApplicationEventLog({
      user_id: event.user.id,
      project_id: event.project_id,
      action_type: event.action_type,
      message: event.message,
    })

    await NatsService.publish('new-logs', {
      type: event.action_type,
      payload: applicationEventLog,
    })
  }
}
