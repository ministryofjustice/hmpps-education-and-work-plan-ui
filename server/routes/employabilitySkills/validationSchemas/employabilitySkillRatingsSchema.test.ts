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
    {
      rating: 'NOT_CONFIDENT',
      evidence: 'Activity supervisor saw this',
      sessionType: 'CIAG_REVIEW',
      educationCourseName: null,
      industriesWorkshopName: null,
    },
    {
      rating: 'LITTLE_CONFIDENCE',
      evidence: 'Activity supervisor saw this',
      sessionType: 'CIAG_REVIEW',
      educationCourseName: null,
      industriesWorkshopName: null,
    },
    {
      rating: 'QUITE_CONFIDENT',
      evidence: 'Activity supervisor saw this',
      sessionType: 'EDUCATION_REVIEW',
      educationCourseName: 'Maths',
    },
    {
      rating: 'VERY_CONFIDENT',
      evidence: 'Activity supervisor saw this',
      sessionType: 'INDUSTRIES_REVIEW',
      industriesWorkshopName: 'Woodworking',
    },
  ])(
    'happy path - validation passes - rating: $rating, evidence: $evidence, sessionType: $sessionType, educationCourseName: $educationCourseName, industriesWorkshopName: $industriesWorkshopName',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedTransformedRequestBody = {
        rating: requestBody.rating,
        evidence: requestBody.evidence,
        sessionType: requestBody.sessionType,
        educationCourseName: requestBody.educationCourseName,
        industriesWorkshopName: requestBody.industriesWorkshopName,
      }

      // When
      await validate(employabilitySkillRatingsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(expectedTransformedRequestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it.each([
    { rating: '', evidence: 'Activity supervisor saw this', sessionType: 'CIAG_REVIEW' },
    { rating: undefined, evidence: 'Activity supervisor saw this', sessionType: 'CIAG_REVIEW' },
    { rating: null, evidence: 'Activity supervisor saw this', sessionType: 'CIAG_REVIEW' },
  ])(
    'sad path - validation of rating field fails mandatory checks - rating: $rating, evidence: $evidence, sessionType: $sessionType',
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
    { rating: 'QUITE_CONFIDENT', evidence: 'Activity supervisor saw this', sessionType: '' },
    { rating: 'QUITE_CONFIDENT', evidence: 'Activity supervisor saw this', sessionType: undefined },
    { rating: 'QUITE_CONFIDENT', evidence: 'Activity supervisor saw this', sessionType: null },
  ])(
    'sad path - validation of sessionType field fails mandatory checks - rating: $rating, evidence: $evidence, sessionType: $sessionType',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#sessionType',
          text: 'Select an activity or session type',
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
    {
      rating: 'QUITE_CONFIDENT',
      evidence: 'Activity supervisor saw this',
      sessionType: 'EDUCATION_REVIEW',
      educationCourseName: '',
    },
    {
      rating: 'QUITE_CONFIDENT',
      evidence: 'Activity supervisor saw this',
      sessionType: 'EDUCATION_REVIEW',
      educationCourseName: '   ',
    },
    {
      rating: 'QUITE_CONFIDENT',
      evidence: 'Activity supervisor saw this',
      sessionType: 'EDUCATION_REVIEW',
      educationCourseName: null,
    },
    {
      rating: 'QUITE_CONFIDENT',
      evidence: 'Activity supervisor saw this',
      sessionType: 'EDUCATION_REVIEW',
      educationCourseName: undefined,
    },
  ])(
    'sad path - validation of educationCourseName field fails mandatory checks - rating: $rating, evidence: $evidence, sessionType: $sessionType, educationCourseName: $educationCourseName',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#educationCourseName',
          text: 'Enter an education course name',
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
    {
      rating: 'QUITE_CONFIDENT',
      evidence: 'Activity supervisor saw this',
      sessionType: 'INDUSTRIES_REVIEW',
      industriesWorkshopName: '',
    },
    {
      rating: 'QUITE_CONFIDENT',
      evidence: 'Activity supervisor saw this',
      sessionType: 'INDUSTRIES_REVIEW',
      industriesWorkshopName: '   ',
    },
    {
      rating: 'QUITE_CONFIDENT',
      evidence: 'Activity supervisor saw this',
      sessionType: 'INDUSTRIES_REVIEW',
      industriesWorkshopName: null,
    },
    {
      rating: 'QUITE_CONFIDENT',
      evidence: 'Activity supervisor saw this',
      sessionType: 'INDUSTRIES_REVIEW',
      industriesWorkshopName: undefined,
    },
  ])(
    'sad path - validation of industriesWorkshopName field fails mandatory checks - rating: $rating, evidence: $evidence, sessionType: $sessionType, industriesWorkshopName: industriesWorkshopName',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#industriesWorkshopName',
          text: 'Enter an industries workshop name',
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
    { rating: 'NOT_CONFIDENT', evidence: '', sessionType: 'CIAG_REVIEW' },
    { rating: 'NOT_CONFIDENT', evidence: '   ', sessionType: 'CIAG_REVIEW' },
    { rating: 'NOT_CONFIDENT', evidence: undefined, sessionType: 'CIAG_REVIEW' },
    { rating: 'NOT_CONFIDENT', evidence: null, sessionType: 'CIAG_REVIEW' },
  ])(
    'sad path - validation of evidence field fails mandatory checks - rating: $rating, evidence: $evidence, sessionType: $sessionType',
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

  it('sad path - validation of rating, evidence and sessionType fields fail mandatory checks', async () => {
    // Given
    const requestBody = {}
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#rating',
        text: 'Select a confidence rating',
      },
      {
        href: '#sessionType',
        text: 'Select an activity or session type',
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

  it('sad path - validation of rating, evidence and educationCourseName fields fail mandatory checks', async () => {
    // Given
    const requestBody = {
      rating: '',
      evidence: '',
      sessionType: 'EDUCATION_REVIEW',
      educationCourseName: '',
    }
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
      {
        href: '#educationCourseName',
        text: 'Enter an education course name',
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

  it('sad path - validation of rating, evidence and industriesWorkshopName fields fail mandatory checks', async () => {
    // Given
    const requestBody = {
      rating: '',
      evidence: '',
      sessionType: 'INDUSTRIES_REVIEW',
      industriesWorkshopName: '',
    }
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
      {
        href: '#industriesWorkshopName',
        text: 'Enter an industries workshop name',
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
      sessionType: 'CIAG_REVIEW',
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
      sessionType: 'CIAG_REVIEW',
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

  it('sad path - sessionType field invalid type', async () => {
    // Given
    const requestBody = {
      rating: 'LITTLE_CONFIDENCE',
      evidence: 'Activity supervisor saw this',
      sessionType: 'not-a-valid-value',
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#sessionType',
        text: 'Select an activity or session type',
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

  it('sad path - educationCourseName field exceeds max length', async () => {
    // Given
    const requestBody = {
      rating: 'NOT_CONFIDENT',
      evidence: 'Attempted to demonstrate in class, but lacks confidence',
      sessionType: 'EDUCATION_REVIEW',
      educationCourseName: 'a'.repeat(101),
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#educationCourseName',
        text: 'Course name must be 100 characters or less',
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

  it('sad path - industriesWorkshopName field exceeds max length', async () => {
    // Given
    const requestBody = {
      rating: 'NOT_CONFIDENT',
      evidence: 'Attempted to demonstrate in workshop, but lacks confidence',
      sessionType: 'INDUSTRIES_REVIEW',
      industriesWorkshopName: 'a'.repeat(101),
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#industriesWorkshopName',
        text: 'Workshop name must be 100 characters or less',
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
