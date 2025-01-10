import vine from '@vinejs/vine'

/**
 *  Type manuel basé sur le schéma pour typé le validateur.
 */
export type SignInPayload = {
  email: string
  password: string
}

/**
 * Validation rules for the login form.
 */
// eslint-disable-next-line @typescript-eslint/typedef
export const signInValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().toLowerCase(),
    password: vine.string().minLength(8),
  }),
)
