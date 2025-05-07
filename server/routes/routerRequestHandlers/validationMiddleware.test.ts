import { Request, Response } from 'express'
import { z } from 'zod'
import { addDays, format, startOfToday, subDays } from 'date-fns'
import { createSchema, dateIsTodayOrInThePast, validate } from './validationMiddleware'

describe('validationMiddleware', () => {
  const req = {
    body: {},
    flash: jest.fn(),
    originalUrl: '',
  } as unknown as Request
  const res = {
    redirectWithErrors: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.originalUrl = '/some-url'
  })

  describe('validate', () => {
    const schema = createSchema({
      title: z.string().max(10, 'Title must be 10 characters or less'),
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

  describe('dateIsTodayOrInThePast', () => {
    const todayDate = startOfToday()
    const today = format(todayDate, 'yyyy-MM-dd')
    const yesterday = format(subDays(todayDate, 1), 'yyyy-MM-dd')
    const tomorrow = format(addDays(todayDate, 1), 'yyyy-MM-dd')

    const schema = createSchema({
      dateOfBirth: dateIsTodayOrInThePast({
        mandatoryMessage: 'DOB is required',
        invalidFormatMessage: 'DOB is not a valid date',
        invalidMessage: 'DOB must be today or in the past',
        pattern: 'yyyy-MM-dd',
      }),
    })
    const validateMiddleware = validate(schema)

    it.each([
      //
      { dateOfBirth: today },
      { dateOfBirth: yesterday },
    ])('should validate and call next given valid date $dateOfBirth', async requestBody => {
      // Given
      req.body = requestBody

      // When
      await validateMiddleware(req, res, next)

      // Then
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    })

    it('should redirect with errors given future date', async () => {
      // Given
      req.body = { dateOfBirth: tomorrow }

      // When
      await validateMiddleware(req, res, next)

      // Then
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', JSON.stringify(req.body))
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/some-url', [
        { href: '#dateOfBirth', text: 'DOB must be today or in the past' },
      ])
    })

    it.each([
      //
      { dateOfBirth: '' },
      { dateOfBirth: null },
      { dateOfBirth: undefined },
    ])('should redirect with errors given missing date: $dateOfBirth', async requestBody => {
      req.body = requestBody

      // When
      await validateMiddleware(req, res, next)

      // Then
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', JSON.stringify(req.body))
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/some-url', [
        { href: '#dateOfBirth', text: 'DOB is required' },
      ])
    })

    it.each([
      { dateOfBirth: 'today' },
      { dateOfBirth: '01/10/2021' }, // invalid against the configured patten in the schema
      { dateOfBirth: ' /1/2024' },
      { dateOfBirth: '/1/2024' },
      { dateOfBirth: '1/2024' },
      { dateOfBirth: '20//2024' },
      { dateOfBirth: '20/ /2024' },
      { dateOfBirth: '20/1/' },
      { dateOfBirth: '20/1' },
      { dateOfBirth: 'ABC/1/2024' },
      { dateOfBirth: '20/DEF/2024' },
      { dateOfBirth: '20/1/HJI' },
      { dateOfBirth: '020/1/2024' },
      { dateOfBirth: '20/001/2024' },
      { dateOfBirth: '20/13/2024' },
      { dateOfBirth: '20/1/24' },
    ])('should redirect with errors given invalid format date: $dateOfBirth', async requestBody => {
      req.body = requestBody

      // When
      await validateMiddleware(req, res, next)

      // Then
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', JSON.stringify(req.body))
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/some-url', [
        { href: '#dateOfBirth', text: 'DOB is not a valid date' },
      ])
    })
  })
})
