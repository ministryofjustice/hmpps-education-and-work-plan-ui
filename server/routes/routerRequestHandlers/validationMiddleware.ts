import { RequestHandler, Request, Response } from 'express'
import { z } from 'zod'
import { format, getYear, isAfter, isBefore, isValid, isWithinInterval, parse, startOfToday } from 'date-fns'
import type { Error } from '../../filters/findErrorFilter'

const FLASH_KEY__INVALID_FORM_DATA = 'invalidForm'

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

type BaseDateOptions = { mandatoryMessage: string; invalidFormatMessage: string; pattern?: string }
const dateTransformer = ({ mandatoryMessage, invalidFormatMessage, pattern = 'd/M/yyyy' }: BaseDateOptions) =>
  z //
    .string({ message: mandatoryMessage })
    .min(1, mandatoryMessage)
    .transform(dateString => parse(dateString, pattern, startOfToday()))
    .refine(date => isValid(date) && getYear(date) >= 1900, invalidFormatMessage)

/**
 * Creates a zod schema object
 */
export const createSchema = <T = object>(shape: T) => zodAlwaysRefine(zObjectStrict(shape))

/**
 * Helper function for when creating a zod schema, this function can be used to set a field to be validated as a Date whose
 * value is today or in the past (ie. not a future date)
 */
export const dateIsTodayOrInThePast = (options: BaseDateOptions & { invalidMessage: string }) =>
  dateTransformer(options)
    .refine(date => !isAfter(date, startOfToday()), options.invalidMessage)
    .transform(date => (isValid(date) ? format(date, 'd/M/yyyy') : date))

/**
 * Helper function for when creating a zod schema, this function can be used to set a field to be validated as a Date whose
 * value is today or in the future (ie. not a past date)
 */
export const dateIsTodayOrInTheFuture = (options: BaseDateOptions & { invalidMessage: string }) =>
  dateTransformer(options)
    .refine(date => !isBefore(date, startOfToday()), options.invalidMessage)
    .transform(date => (isValid(date) ? format(date, 'd/M/yyyy') : date))

/**
 * Helper function for when creating a zod schema, this function can be used to set a field to be validated as a Date whose
 * value is within the specified `start` and `end` dates.
 */
export const dateIsWithinInterval = (options: BaseDateOptions & { invalidMessage: string; start: Date; end: Date }) =>
  dateTransformer(options)
    .refine(date => isWithinInterval(date, { start: options.start, end: options.end }), options.invalidMessage)
    .transform(date => (isValid(date) ? format(date, 'd/M/yyyy') : date))

/**
 * Function that returns a middleware that will validate the request body against the given schema.
 * On successful validation `next` is called; else redirectWithErrors is called on the response object, where the errors
 * flash key is populated with the validation errors in a form suitable for rendering in a nunjucks template with the
 * nunjucks error filter.
 */
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

    const deduplicatedFieldErrors: Array<Error> = Object.entries(z.flattenError(result.error).fieldErrors)
      .map(([key, value]) => [key, [...new Set(value as string)]])
      .map(([key, value]) => ({ href: `#${key}`, text: value[0] }))
      .concat(z.flattenError(result.error).formErrors.map(error => ({ href: '#', text: error })))

    return res.redirectWithErrors(req.originalUrl, deduplicatedFieldErrors)
  }
}
