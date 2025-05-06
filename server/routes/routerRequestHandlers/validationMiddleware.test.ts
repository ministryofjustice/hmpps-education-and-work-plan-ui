import { Request, Response } from 'express'
import { z } from 'zod'
import { createSchema, validate } from './validationMiddleware'

describe('validationMiddleware', () => {
  describe('validate', () => {
    const req = {
      body: {},
      flash: jest.fn(),
      originalUrl: '',
    } as unknown as Request
    const res = {
      redirectWithErrors: jest.fn(),
    } as unknown as Response
    const next = jest.fn()

    const schema = createSchema({
      title: z.string().max(10, 'Title must be 10 characters or less'),
    })

    beforeEach(() => {
      jest.resetAllMocks()
      req.body = {}
      req.originalUrl = '/some-url'
    })

    it('should call next given no schema to validate against', async () => {
      // Given
      const nullSchema = undefined as z.ZodTypeAny
      const validateMiddleware = validate(nullSchema)

      // When
      await validateMiddleware(req, res, next)

      // Then
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    })

    it('should call next given request body validates against schema', async () => {
      // Given
      const validateMiddleware = validate(schema)

      req.body = { title: 'A title' }

      // When
      await validateMiddleware(req, res, next)

      // Then
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    })

    it('should redirect with errors given request body does not validate against schema', async () => {
      // Given
      const validateMiddleware = validate(schema)

      req.body = { title: 'A title that is longer than the schema allows' }

      // When
      await validateMiddleware(req, res, next)

      // Then
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', JSON.stringify(req.body))
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/some-url', [
        { href: '#title', text: 'Title must be 10 characters or less' },
      ])
    })

    it('should redirect with errors given request body has additional fields not specified in the schema', async () => {
      // Given
      const validateMiddleware = validate(schema)

      req.body = { title: 'A title', someOtherField: 'Some other field' }

      // When
      await validateMiddleware(req, res, next)

      // Then
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', JSON.stringify(req.body))
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/some-url', [
        { href: '#', text: `Unrecognized key(s) in object: 'someOtherField'` },
      ])
    })
  })
})
