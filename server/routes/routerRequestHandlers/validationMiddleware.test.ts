import { Request, Response } from 'express'
import { z } from 'zod'
import { addDays, format, startOfToday, subDays } from 'date-fns'
import {
  createSchema,
  dateIsTodayOrInTheFuture,
  dateIsTodayOrInThePast,
  dateIsWithinInterval,
  validate,
} from './validationMiddleware'

describe('validationMiddleware', () => {
  const todayDate = startOfToday()
  const today = format(todayDate, 'yyyy-MM-dd')
  const yesterdayDate = subDays(todayDate, 1)
  const yesterday = format(yesterdayDate, 'yyyy-MM-dd')
  const tomorrowDate = addDays(todayDate, 1)
  const tomorrow = format(tomorrowDate, 'yyyy-MM-dd')

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
        { href: '#', text: 'Unrecognized key: "someOtherField"' },
      ])
    })
  })

  describe('dateIsTodayOrInThePast', () => {
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

  describe('dateIsTodayOrInTheFuture', () => {
    const schema = createSchema({
      reviewDate: dateIsTodayOrInTheFuture({
        mandatoryMessage: 'Review Date is required',
        invalidFormatMessage: 'Review Date is not a valid date',
        invalidMessage: 'Review Date must be today or in the future',
        pattern: 'yyyy-MM-dd',
      }),
    })
    const validateMiddleware = validate(schema)

    it.each([
      //
      { reviewDate: today },
      { reviewDate: tomorrow },
    ])('should validate and call next given valid date $reviewDate', async requestBody => {
      // Given
      req.body = requestBody

      // When
      await validateMiddleware(req, res, next)

      // Then
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    })

    it('should redirect with errors given past date', async () => {
      // Given
      req.body = { reviewDate: yesterday }

      // When
      await validateMiddleware(req, res, next)

      // Then
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', JSON.stringify(req.body))
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/some-url', [
        { href: '#reviewDate', text: 'Review Date must be today or in the future' },
      ])
    })

    it.each([
      //
      { reviewDate: '' },
      { reviewDate: null },
      { reviewDate: undefined },
    ])('should redirect with errors given missing date: $reviewDate', async requestBody => {
      req.body = requestBody

      // When
      await validateMiddleware(req, res, next)

      // Then
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', JSON.stringify(req.body))
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/some-url', [
        { href: '#reviewDate', text: 'Review Date is required' },
      ])
    })

    it.each([
      { reviewDate: 'today' },
      { reviewDate: '01/10/2021' }, // invalid against the configured patten in the schema
      { reviewDate: ' /1/2024' },
      { reviewDate: '/1/2024' },
      { reviewDate: '1/2024' },
      { reviewDate: '20//2024' },
      { reviewDate: '20/ /2024' },
      { reviewDate: '20/1/' },
      { reviewDate: '20/1' },
      { reviewDate: 'ABC/1/2024' },
      { reviewDate: '20/DEF/2024' },
      { reviewDate: '20/1/HJI' },
      { reviewDate: '020/1/2024' },
      { reviewDate: '20/001/2024' },
      { reviewDate: '20/13/2024' },
      { reviewDate: '20/1/24' },
    ])('should redirect with errors given invalid format date: $reviewDate', async requestBody => {
      req.body = requestBody

      // When
      await validateMiddleware(req, res, next)

      // Then
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', JSON.stringify(req.body))
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/some-url', [
        { href: '#reviewDate', text: 'Review Date is not a valid date' },
      ])
    })
  })

  describe('dateIsWithinInterval', () => {
    const schema = createSchema({
      reviewDate: dateIsWithinInterval({
        mandatoryMessage: 'Review Date is required',
        invalidFormatMessage: 'Review Date is not a valid date',
        invalidMessage: 'Review Date must be 1 day before of after today',
        pattern: 'yyyy-MM-dd',
        start: yesterdayDate,
        end: tomorrowDate,
      }),
    })
    const validateMiddleware = validate(schema)

    it.each([
      //
      { reviewDate: yesterday },
      { reviewDate: today },
      { reviewDate: tomorrow },
    ])('should validate and call next given valid date $reviewDate', async requestBody => {
      // Given
      req.body = requestBody

      // When
      await validateMiddleware(req, res, next)

      // Then
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    })

    it.each([
      { reviewDate: format(subDays(yesterdayDate, 1), 'yyyy-MM-dd') },
      { reviewDate: format(addDays(tomorrowDate, 1), 'yyyy-MM-dd') },
    ])('should redirect with errors given date $reviewDate which is outside of date range', async requestBody => {
      // Given
      req.body = requestBody

      // When
      await validateMiddleware(req, res, next)

      // Then
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', JSON.stringify(req.body))
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/some-url', [
        { href: '#reviewDate', text: 'Review Date must be 1 day before of after today' },
      ])
    })

    it.each([
      //
      { reviewDate: '' },
      { reviewDate: null },
      { reviewDate: undefined },
    ])('should redirect with errors given missing date: $reviewDate', async requestBody => {
      req.body = requestBody

      // When
      await validateMiddleware(req, res, next)

      // Then
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', JSON.stringify(req.body))
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/some-url', [
        { href: '#reviewDate', text: 'Review Date is required' },
      ])
    })

    it.each([
      { reviewDate: 'today' },
      { reviewDate: '01/10/2021' }, // invalid against the configured patten in the schema
      { reviewDate: ' /1/2024' },
      { reviewDate: '/1/2024' },
      { reviewDate: '1/2024' },
      { reviewDate: '20//2024' },
      { reviewDate: '20/ /2024' },
      { reviewDate: '20/1/' },
      { reviewDate: '20/1' },
      { reviewDate: 'ABC/1/2024' },
      { reviewDate: '20/DEF/2024' },
      { reviewDate: '20/1/HJI' },
      { reviewDate: '020/1/2024' },
      { reviewDate: '20/001/2024' },
      { reviewDate: '20/13/2024' },
      { reviewDate: '20/1/24' },
    ])('should redirect with errors given invalid format date: $reviewDate', async requestBody => {
      req.body = requestBody

      // When
      await validateMiddleware(req, res, next)

      // Then
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', JSON.stringify(req.body))
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/some-url', [
        { href: '#reviewDate', text: 'Review Date is not a valid date' },
      ])
    })
  })
})
