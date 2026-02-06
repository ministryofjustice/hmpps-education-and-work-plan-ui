import { Request, Response } from 'express'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import type { Error } from '../../../filters/findErrorFilter'
import employabilitySkillRatingsSchema from './employabilitySkillRatingsSchema'

describe('employabilitySkillRatingsSchema', () => {
  const req = {
    originalUrl: '',
    body: {},
    flash: jest.fn(),
  } as unknown as Request
  const res = {
    redirectWithErrors: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.originalUrl = '/plan/A1234BC/employability-skills/PROBLEM_SOLVING/12345/add'
  })

  it.each([
    { rating: 'NOT_CONFIDENT', evidence: 'Activity supervisor saw this' },
    { rating: 'LITTLE_CONFIDENCE', evidence: 'Activity supervisor saw this' },
    { rating: 'QUITE_CONFIDENT', evidence: 'Activity supervisor saw this' },
    { rating: 'VERY_CONFIDENT', evidence: 'Activity supervisor saw this' },
  ])('happy path - validation passes - rating: $rating, evidence: $evidence', async requestBody => {
    // Given
    req.body = requestBody

    const expectedTransformedRequestBody = {
      rating: requestBody.rating,
      evidence: requestBody.evidence,
    }

    // When
    await validate(employabilitySkillRatingsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(expectedTransformedRequestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    { rating: '', evidence: 'Activity supervisor saw this' },
    { rating: undefined, evidence: 'Activity supervisor saw this' },
    { rating: null, evidence: 'Activity supervisor saw this' },
  ])(
    'sad path - validation of rating field fails mandatory checks - rating: $rating, evidence: $evidence',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#rating',
          text: 'Select a confidence rating',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(employabilitySkillRatingsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/plan/A1234BC/employability-skills/PROBLEM_SOLVING/12345/add',
        expectedErrors,
      )
    },
  )

  it.each([
    { rating: 'NOT_CONFIDENT', evidence: '' },
    { rating: 'NOT_CONFIDENT', evidence: '   ' },
    { rating: 'NOT_CONFIDENT', evidence: undefined },
    { rating: 'NOT_CONFIDENT', evidence: null },
  ])(
    'sad path - validation of evidence field fails mandatory checks - rating: $rating, evidence: $evidence',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#evidence',
          text: 'Enter evidence for the rating given',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(employabilitySkillRatingsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/plan/A1234BC/employability-skills/PROBLEM_SOLVING/12345/add',
        expectedErrors,
      )
    },
  )

  it('sad path - validation of both rating and evidence fields fail mandatory checks', async () => {
    // Given
    const requestBody = {}
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#rating',
        text: 'Select a confidence rating',
      },
      {
        href: '#evidence',
        text: 'Enter evidence for the rating given',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(employabilitySkillRatingsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/plan/A1234BC/employability-skills/PROBLEM_SOLVING/12345/add',
      expectedErrors,
    )
  })

  it('sad path - evidence field exceeds max length', async () => {
    // Given
    const requestBody = {
      rating: 'NOT_CONFIDENT',
      evidence: 'a'.repeat(201),
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#evidence',
        text: 'Evidence must be 200 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(employabilitySkillRatingsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/plan/A1234BC/employability-skills/PROBLEM_SOLVING/12345/add',
      expectedErrors,
    )
  })

  it('sad path - rating field invalid type', async () => {
    // Given
    const requestBody = {
      rating: 'not-a-valid-value',
      evidence: 'Activity supervisor saw this',
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#rating',
        text: 'Select a confidence rating',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(employabilitySkillRatingsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/plan/A1234BC/employability-skills/PROBLEM_SOLVING/12345/add',
      expectedErrors,
    )
  })
})
