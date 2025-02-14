import vine from '@vinejs/vine'

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
