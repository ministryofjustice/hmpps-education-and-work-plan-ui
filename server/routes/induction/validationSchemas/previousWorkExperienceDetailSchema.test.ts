import { Request, Response } from 'express'
import previousWorkExperienceDetailSchema from './previousWorkExperienceDetailSchema'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import type { Error } from '../../../filters/findErrorFilter'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'

describe('previousWorkExperienceDetailSchema', () => {
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    originalUrl: '',
    body: {},
    flash: jest.fn(),
  } as unknown as Request
  const res = {
    locals: { prisonerSummary },
    redirectWithErrors: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.originalUrl = '/prisoners/A1234BC/create-induction/12345/previous-work-experience/construction'
  })

  it.each([
    { jobRole: 'Gardner', jobDetails: 'Tending the roses' },
    { jobRole: 'Shop assistant', jobDetails: 'Serving customers and stacking shelves' },
  ])('happy path - validation passes - jobRole: $jobRole, jobDetails: $jobDetails', async requestBody => {
    // Given
    req.body = requestBody

    const expectedTransformedRequestBody = {
      jobRole: requestBody.jobRole,
      jobDetails: requestBody.jobDetails,
    }

    // When
    await validate(previousWorkExperienceDetailSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(expectedTransformedRequestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    { jobRole: '', jobDetails: 'Tending the roses' },
    { jobRole: undefined, jobDetails: 'Tending the roses' },
    { jobRole: null, jobDetails: 'Tending the roses' },
  ])('sad path - validation of jobRole field fails - jobRole: $jobRole, jobDetails: $jobDetails', async requestBody => {
    // Given
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#jobRole',
        text: 'Enter the job role Ifereeca Peigh wants to add',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(previousWorkExperienceDetailSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/previous-work-experience/construction',
      expectedErrors,
    )
  })

  it('sad path - job role value exceeds length', async () => {
    // Given
    const requestBody = { jobRole: 'a'.repeat(257), jobDetails: 'Tending the roses' }

    req.body = requestBody

    const expectedErrors: Array<Error> = [{ href: '#jobRole', text: 'Job role must be 256 characters or less' }]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(previousWorkExperienceDetailSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/previous-work-experience/construction',
      expectedErrors,
    )
  })

  it.each([
    { jobRole: 'Gardener', jobDetails: '' },
    { jobRole: 'Gardener', jobDetails: undefined },
    { jobRole: 'Gardener', jobDetails: null },
  ])(
    'sad path - validation of jobDetails field fails - jobRole: $jobRole, jobDetails: $jobDetails',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#jobDetails',
          text: 'Enter details of what Ifereeca Peigh did in their job',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(previousWorkExperienceDetailSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/previous-work-experience/construction',
        expectedErrors,
      )
    },
  )

  it('sad path - job details value exceeds length', async () => {
    // Given
    const requestBody = { jobRole: 'Gardener', jobDetails: 'a'.repeat(513) }

    req.body = requestBody

    const expectedErrors: Array<Error> = [
      { href: '#jobDetails', text: 'Main tasks and responsibilities must be 512 characters or less' },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(previousWorkExperienceDetailSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/previous-work-experience/construction',
      expectedErrors,
    )
  })
})
