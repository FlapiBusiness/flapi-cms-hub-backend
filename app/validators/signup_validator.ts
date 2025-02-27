import vine, { SimpleMessagesProvider } from '@vinejs/vine'
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
      .normalizeEmail()
      .email()
      .unique(async (db: Database, value: string) => {
        const existingUser: User = await db.from('users').where('email', value).first()
        return !existingUser
      }),
    password: vine
      .string()
      .trim()
      .minLength(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])[A-Za-z\d\S]{8,}$/),
    password_confirmation: vine
      .string()
      .trim()
      .minLength(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])[A-Za-z\d\S]{8,}$/),
  }),
)

vine.messagesProvider = new SimpleMessagesProvider({
  // Erreurs pour l'email
  'email.required': 'Veuillez entrer une adresse e-mail.',
  'email.email': 'Veuillez entrer une adresse e-mail valide.',
  'email.unique': 'Cet e-mail est déjà utilisé.',

  // Erreurs pour le mot de passe
  'password.required': 'Le mot de passe est obligatoire.',
  'password.minLength': 'Le mot de passe doit contenir au moins 8 caractères.',
  'password.regex':
    'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.',

  // Erreurs pour la confirmation du mot de passe
  'password_confirmation.required': 'La confirmation du mot de passe est obligatoire.',
  'password_confirmation.minLength': 'La confirmation du mot de passe doit contenir au moins 8 caractères.',
  'password_confirmation.regex':
    'La confirmation du mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.',

  // Erreurs pour prénom et nom de famille
  'firstname.required': 'Le prénom est obligatoire.',
  'lastname.required': 'Le nom de famille est obligatoire.',
})
