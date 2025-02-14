import vine from '@vinejs/vine'

// eslint-disable-next-line @typescript-eslint/typedef
export const domainValidator = vine
  .string()
  .trim()
  .regex(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/)
