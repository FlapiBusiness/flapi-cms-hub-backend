import vine from '@vinejs/vine'

/**
 *  Manual type based on the diagram for typical the validator.
 */
export type LoginPayload = {
  email: string
  password: string
}

/**
 * Validation rules for the login form.
 */
// eslint-disable-next-line @typescript-eslint/typedef
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().toLowerCase(),
    password: vine.string().minLength(8),
  }),
)
