import vine from '@vinejs/vine'
import type User from '#models/user'
import type { Database } from '@adonisjs/lucid/database'
import type ProjectSetup from '#models/project_setup'

/**
 * Validation rules for create the project form.
 */
// eslint-disable-next-line @typescript-eslint/typedef
export const createProjectValidator = vine.compile(
  vine.object({
    customer_user_id: vine.number().exists(async (db: Database, value: number) => {
      const user: User | null = await db.from('users').where('id', value).first()
      return !!user
    }),
    customer_name: vine.string().trim(),
    application_name: vine.string().trim().minLength(3).maxLength(255),
    domain_name: vine.string(),
    // short_description: vine.string().trim().optional(),
    // long_description: vine.string().trim().optional(),
    // category: vine.string().trim().optional(),
    project_setup_id: vine
      .number()
      .exists(async (db: Database, value: number) => {
        const projectSetup: ProjectSetup | null = await db.from('project_setups').where('id', value).first()
        return !!projectSetup
      })
      .optional(),
  }),
)

// eslint-disable-next-line @typescript-eslint/typedef
export const updateProjectValidator = vine.compile(
  vine.object({
    customer_user_id: vine
      .number()
      .exists(async (db: Database, value: number) => {
        const user: User | null = await db.from('users').where('id', value).first()
        return !!user
      })
      .optional(),
    customer_name: vine.string().trim().optional(),
    application_name: vine.string().trim().minLength(3).maxLength(255).optional(),
    domain_name: vine.string().optional(),
    // short_description: vine.string().trim().optional(),
    // long_description: vine.string().trim().optional(),
    // category: vine.string().trim().optional(),
    project_setup_id: vine
      .number()
      .exists(async (db: Database, value: number) => {
        const projectSetup: ProjectSetup | null = await db.from('project_setups').where('id', value).first()
        return !!projectSetup
      })
      .optional(),
  }),
)
