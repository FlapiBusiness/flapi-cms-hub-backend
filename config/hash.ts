import { defineConfig, drivers } from '@adonisjs/core/hash'
import env from '#start/env'

const hashConfig = defineConfig({
  default: env.get('HASH_DRIVER'),

  list: {
    scrypt: drivers.scrypt({
      cost: 16384,
      blockSize: 8,
      parallelization: 1,
      maxMemory: 33554432,
    }),

    argon: drivers.argon2({
      version: 0x13, // hex code for 19
      variant: 'id',
      iterations: 3,
      memory: 65536,
      parallelism: 4,
      saltSize: 16,
      hashLength: 32,
    }),

    bcrypt: drivers.bcrypt({
      rounds: 10,
      saltSize: 16,
      version: 0x61,
    }),
  },
})

export default hashConfig

/**
 * Inferring types for the list of hashers you have configured
 * in your application.
 */
declare module '@adonisjs/core/types' {
  export interface HashersList extends InferHashers<typeof hashConfig> {}
}
