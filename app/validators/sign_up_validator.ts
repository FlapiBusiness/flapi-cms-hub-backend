import vine from '@vinejs/vine'
import type { Database } from '@adonisjs/lucid/database'
import type UserRole from '#models/user_role'
import type User from '#models/user'

/**
 * Type manuel basé sur le schéma pour typé le validateur.
 */
export type SignUpPayload = {
  role_id: number
  lastname: string
  firstname: string
  email: string
  password: string
  ip_address: string
  ip_region: string
  currency_code: string
}

/**
 * Validation rules for the sign up form.
 */
// eslint-disable-next-line @typescript-eslint/typedef
export const signUpValidator = vine.compile(
  vine.object({
    role_id: vine.number().exists(async (db: Database, value: number) => {
      const role: UserRole | null = await db.from('user_roles').where('id', value).first()
      return !!role
    }),
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
    ip_address: vine.string().ipAddress(4),
    ip_region: vine.string(),
    currency_code: vine.string(),
  }),
)
