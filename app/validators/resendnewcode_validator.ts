import vine from '@vinejs/vine'

/**
 *  @type {object} ResendNewCodePayload - The payload for resending a new code to the user.
 *  @property {string} email - The email address of the user.
 */
export type ResendNewCodePayload = {
  email: string
}

/**
 * Validation rules for the resend new code form.
 */
// eslint-disable-next-line @typescript-eslint/typedef
export const resendNewCodeValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().toLowerCase(),
  }),
)
