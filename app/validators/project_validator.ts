import vine from '@vinejs/vine'
import type User from '#models/user'
import type { Database } from '@adonisjs/lucid/database'

/**
 * Validation rules for create the project form.
 */
// eslint-disable-next-line @typescript-eslint/typedef
export const createProjectValidator = vine.compile(
  vine.object({
    application_name: vine.string().trim().minLength(3).maxLength(255),
    user_id: vine.number().exists(async (db: Database, value: number) => {
      const user: User | null = await db.from('users').where('id', value).first()
      return !!user
    }),
    domain_name: vine.string(),
    file_id: vine.number(),
    database_id: vine.number(),
  }),
)

// eslint-disable-next-line @typescript-eslint/typedef
export const updateProjectValidator = vine.compile(
  vine.object({
    application_name: vine.string().trim().minLength(3).maxLength(255).optional(),
    user_id: vine
      .number()
      .exists(async (db: Database, value: number) => {
        const user: User | null = await db.from('users').where('id', value).first()
        return !!user
      })
      .optional(),
    domain_name: vine.string().optional(),
    file_id: vine.number().optional(),
    database_id: vine.number().optional(),
  }),
)
