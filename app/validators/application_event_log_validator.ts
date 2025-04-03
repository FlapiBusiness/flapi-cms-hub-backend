// app/validators/application_event_log_validator.ts
import vine from '@vinejs/vine'
import type User from '#models/user'
import type Project from '#models/project'
import { ApplicationEventLogActionType } from '#enums/application_event_log_action_type'
import type { Database } from '@adonisjs/lucid/database'

/**
 * Validation rules for creating an application event log.
 */
// eslint-disable-next-line @typescript-eslint/typedef
export const createApplicationEventLogValidator = vine.compile(
  vine.object({
    user_id: vine
      .number()
      .exists(async (db: Database, value: number): Promise<boolean> => {
        const user: User | null = await db.from('users').where('id', value).first()
        return !!user
      })
      .optional(),
    project_id: vine
      .number()
      .exists(async (db: Database, value: number): Promise<boolean> => {
        const project: Project | null = await db.from('projects').where('id', value).first()
        return !!project
      })
      .optional(),
    action_type: vine.enum(Object.values(ApplicationEventLogActionType)),
    message: vine.string().trim(),
  }),
)
