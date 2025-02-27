import vine from '@vinejs/vine'
import type { Database } from '@adonisjs/lucid/database'
import type User from '#models/user'

/**
 * Validation rules for the sign-up form.
 */
// eslint-disable-next-line @typescript-eslint/typedef
export const signUpValidator = vine.compile(
  vine.object({
    lastname: vine.string().trim(),
    firstname: vine.string().trim(),
    email: vine
      .string()
      .email()
      .unique(async (db: Database, value: string) => {
        const existingUser: User = await db.from('users').where('email', value).first()
        return !existingUser
      }),
    password: vine
      .string()
      .minLength(8)
      .confirmed()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])[A-Za-z\d\S]{8,}$/),
    password_confirmation: vine.string(),
  }),
)
