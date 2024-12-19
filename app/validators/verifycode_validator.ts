import vine from '@vinejs/vine'

/**
 *  @type {object} VerifyCodePayload - The payload for verifying the user's account with a code.
 *  @property {string} email - The email address of the user.
 *  @property {number} code - The 6-digit active code for the user.
 */
export type VerifyCodePayload = {
  email: string
  code: number
}

/**
 * Validation rules for the verify code form.
 */
// eslint-disable-next-line @typescript-eslint/typedef
export const verifyCodeValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().toLowerCase(),
    code: vine.number().min(100000).max(999999),
  }),
)
