/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'development-remote', 'staging', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
  HASH_DRIVER: Env.schema.enum(['scrypt', 'argon', 'bcrypt'] as const),
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),
  DB_DEBUG: Env.schema.boolean(),
  HEALTH: Env.schema.string(),
  AWS_ACCESS_KEY_ID: Env.schema.string(),
  AWS_SECRET_ACCESS_KEY: Env.schema.string(),
  AWS_SERVER_CLUSTER_K3S: Env.schema.string(),
  GITHUB_PERSONAL_ACCESS_TOKEN: Env.schema.string(),
  GITHUB_USERNAME_OR_ORGANIZATION: Env.schema.string(),
  AWS_DOMAIN_FLAPI_HOSTED_ZONE_ID: Env.schema.string(),
  AWS_DOMAIN_FLAPI: Env.schema.string(),
  O2SWITCH_HOST: Env.schema.string(),
  O2SWITCH_API_TOKEN: Env.schema.string(),
  O2SWITCH_USERNAME: Env.schema.string(),
  O2SWITCH_BEGINNING_DATABASE_NAME: Env.schema.string(),
  O2SWITCH_DATABASE_USERNAME: Env.schema.string(),
  O2SWITCH_DATABASE_PASSWORD: Env.schema.string(),
  MAILJET_API_KEY: Env.schema.string(),
  MAILJET_API_SECRET_KEY: Env.schema.string(),
  MAIJET_API_VERSION: Env.schema.string(),
  SMTP_HOST: Env.schema.string({ format: 'host' }),
  SMTP_PORT: Env.schema.number(),
  SMTP_USERNAME: Env.schema.string(),
  SMTP_PASSWORD: Env.schema.string(),
  MAIL_USERNAME: Env.schema.string(),
  API_USER_TOKEN_EXPIRATION: Env.schema.string(),
  API_USER_TOKEN_SECRET_LENGTH: Env.schema.number(),
  FRONTEND_APP_BASE_URL: Env.schema.string(),
  FRONTEND_APP_REDIRECT_URI_ACCOUNT_VALIDATE: Env.schema.string(),
  FRONTEND_APP_REDIRECT_URI_FORGOT_PASSWORD: Env.schema.string(),
  FRONTEND_APP_REDIRECT_URI_SEND_MAIL_TO_MODIFY_EMAIL: Env.schema.string(),
})
