// app/Validators/UpdateUserValidator.ts
import vine from '@vinejs/vine'
/**
 * Définition du schéma de validation pour la mise à jour d'un utilisateur.
 */
// eslint-disable-next-line @typescript-eslint/typedef
export const UpdateUserValidator = vine.compile(
  vine.object({
    lastname: vine.string().trim().optional(),
    firstname: vine.string().trim().optional(),
    email: vine.string().email().optional(),
    password: vine
      .string()
      .minLength(8)
      .confirmed()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])[A-Za-z\d\S]{8,}$/)
      .optional(),
  }),
)
