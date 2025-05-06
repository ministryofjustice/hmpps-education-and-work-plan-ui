import { RequestHandler, Request, Response } from 'express'
import { z } from 'zod'
import type { Error } from '../../filters/findErrorFilter'

const FLASH_KEY__INVALID_FORM_DATA = 'invalidForm'

export const createSchema = <T = object>(shape: T) => zodAlwaysRefine(zObjectStrict(shape))

const zObjectStrict = <T = object>(shape: T) => z.object({ _csrf: z.string().optional(), ...shape }).strict()

/*
 * Ensure that all parts of the schema get tried and can fail before exiting schema checks - this ensures we don't have to
 * have complicated schemas if we want to both ensure the order of fields and have all the schema validation run
 * more info regarding this issue and workaround on: https://github.com/colinhacks/zod/issues/479#issuecomment-2067278879
 */
const zodAlwaysRefine = <T extends z.ZodTypeAny>(zodType: T) =>
  z.any().transform((val, ctx) => {
    const res = zodType.safeParse(val)
    if (!res.success) res.error.issues.forEach(ctx.addIssue)
    return res.data || val
  }) as unknown as T

export type SchemaFactory = (request: Request, res: Response) => Promise<z.ZodTypeAny>

const normaliseNewLines = (body: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(body).map(([k, v]) => [k, typeof v === 'string' ? v.replace(/\r\n/g, '\n') : v]),
  )
}

export const validate = (schema: z.ZodTypeAny | SchemaFactory): RequestHandler => {
  return async (req, res, next) => {
    if (!schema) {
      return next()
    }
    const resolvedSchema = typeof schema === 'function' ? await schema(req, res) : schema
    const result = resolvedSchema.safeParse(normaliseNewLines(req.body))
    if (result.success) {
      req.body = result.data
      return next()
    }

    req.flash(FLASH_KEY__INVALID_FORM_DATA, JSON.stringify(req.body))

    const deduplicatedFieldErrors: Array<Error> = Object.entries(result.error.flatten().fieldErrors)
      .map(([key, value]) => [key, [...new Set(value)]])
      .map(([key, value]) => ({ href: `#${key}`, text: value[0] }))
      .concat(result.error.flatten().formErrors.map(error => ({ href: '#', text: error })))

    return res.redirectWithErrors(req.originalUrl, deduplicatedFieldErrors)
  }
}
