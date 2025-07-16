import { Request, Response } from 'express'
import { addDays, format, startOfToday, subDays } from 'date-fns'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import whoCompletedReviewSchema from './whoCompletedReviewSchema'
import type { Error } from '../../../filters/findErrorFilter'

describe('whoCompletedReviewSchema', () => {
  const todayDate = startOfToday()
  const today = format(todayDate, 'd/M/yyyy')
  const yesterday = format(subDays(todayDate, 1), 'd/M/yyyy')
  const tomorrow = format(addDays(todayDate, 1), 'd/M/yyyy')

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
    req.originalUrl = '/plan/A1234BC/39e5a1a9-0f69-466c-8223-18a2e1cb2d78/review'
  })

  it.each([
    {
      completedBy: 'MYSELF',
      completedByOtherFullName: undefined,
      completedByOtherJobRole: undefined,
      reviewDate: today,
    },
    {
      completedBy: 'MYSELF',
      completedByOtherFullName: undefined,
      completedByOtherJobRole: undefined,
      reviewDate: yesterday,
    },
    {
      completedBy: 'SOMEBODY_ELSE',
      completedByOtherFullName: 'Joe Bloggs',
      completedByOtherJobRole: 'Peer mentor',
      reviewDate: yesterday,
    },
  ])(
    'happy path - validation passes - completedBy: $completedBy, completedByOtherFullName: $completedByOtherFullName, completedByOtherJobRole: $completedByOtherJobRole, reviewDate: $reviewDate',
    async requestBody => {
      // Given
      req.body = requestBody

      // When
      await validate(whoCompletedReviewSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it.each([
    //
    { completedBy: 'a-non-supported-value', reviewDate: yesterday },
    { completedBy: null, reviewDate: yesterday },
    { completedBy: undefined, reviewDate: yesterday },
    { completedBy: '', reviewDate: yesterday },
  ])('sad path - completedBy field validation fails - %s', async requestBody => {
    // Given
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#completedBy',
        text: `Select who completed the review`,
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedReviewSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/plan/A1234BC/39e5a1a9-0f69-466c-8223-18a2e1cb2d78/review',
      expectedErrors,
    )
  })

  it('sad path - mandatory completedByOtherFullName field validation fails', async () => {
    // Given
    const requestBody = {
      completedBy: 'SOMEBODY_ELSE',
      completedByOtherFullName: undefined as string,
      completedByOtherJobRole: 'Peer mentor',
      reviewDate: yesterday,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#completedByOtherFullName',
        text: 'Enter the full name of the person who completed the review',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedReviewSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/plan/A1234BC/39e5a1a9-0f69-466c-8223-18a2e1cb2d78/review',
      expectedErrors,
    )
  })

  it('sad path - completedByOtherFullName field length validation fails', async () => {
    // Given
    const requestBody = {
      completedBy: 'SOMEBODY_ELSE',
      completedByOtherFullName: 'a'.repeat(201),
      completedByOtherJobRole: 'Peer mentor',
      reviewDate: yesterday,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#completedByOtherFullName',
        text: 'Full name must be 200 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedReviewSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/plan/A1234BC/39e5a1a9-0f69-466c-8223-18a2e1cb2d78/review',
      expectedErrors,
    )
  })

  it('sad path - mandatory completedByOtherJobRole field validation fails', async () => {
    // Given
    const requestBody = {
      completedBy: 'SOMEBODY_ELSE',
      completedByOtherFullName: 'Joe Bloggs',
      completedByOtherJobRole: undefined as string,
      reviewDate: yesterday,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#completedByOtherJobRole',
        text: 'Enter the job title of the person who completed the review',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedReviewSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/plan/A1234BC/39e5a1a9-0f69-466c-8223-18a2e1cb2d78/review',
      expectedErrors,
    )
  })

  it('sad path - completedByOtherJobRole field length validation fails', async () => {
    // Given
    const requestBody = {
      completedBy: 'SOMEBODY_ELSE',
      completedByOtherFullName: 'Joe Bloggs',
      completedByOtherJobRole: 'a'.repeat(201),
      reviewDate: yesterday,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#completedByOtherJobRole',
        text: 'Job role must be 200 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedReviewSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/plan/A1234BC/39e5a1a9-0f69-466c-8223-18a2e1cb2d78/review',
      expectedErrors,
    )
  })

  it('sad path - mandatory completedByOtherJobRole and completedByOtherFullName fields validation fails', async () => {
    // Given
    const requestBody = {
      completedBy: 'SOMEBODY_ELSE',
      completedByOtherFullName: undefined as string,
      completedByOtherJobRole: undefined as string,
      reviewDate: yesterday,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#completedByOtherFullName',
        text: 'Enter the full name of the person who completed the review',
      },
      {
        href: '#completedByOtherJobRole',
        text: 'Enter the job title of the person who completed the review',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedReviewSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/plan/A1234BC/39e5a1a9-0f69-466c-8223-18a2e1cb2d78/review',
      expectedErrors,
    )
  })

  it('sad path - future dated reviewDate field validation fails', async () => {
    // Given
    const requestBody = {
      completedBy: 'MYSELF',
      completedByOtherFullName: undefined as string,
      completedByOtherJobRole: undefined as string,
      reviewDate: tomorrow,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#reviewDate',
        text: 'Enter a valid date. Date cannot be in the future',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedReviewSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/plan/A1234BC/39e5a1a9-0f69-466c-8223-18a2e1cb2d78/review',
      expectedErrors,
    )
  })

  it('sad path - missing reviewDate field validation fails', async () => {
    // Given
    const requestBody = {
      completedBy: 'MYSELF',
      completedByOtherFullName: undefined as string,
      completedByOtherJobRole: undefined as string,
      reviewDate: undefined as string,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#reviewDate',
        text: 'Enter a valid date',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedReviewSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/plan/A1234BC/39e5a1a9-0f69-466c-8223-18a2e1cb2d78/review',
      expectedErrors,
    )
  })

  it.each([
    'today',
    '2024-01-01', // invalid against the configured patten in the schema
    '1/13/2024', // invalid against the configured patten in the schema
    '1 Feb 2024',
    '1/2/24',
  ])('sad path - invalid reviewDate field validation fails - %s', async reviewDate => {
    // Given
    const requestBody = {
      completedBy: 'MYSELF',
      completedByOtherFullName: undefined as string,
      completedByOtherJobRole: undefined as string,
      reviewDate,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#reviewDate',
        text: 'Enter a valid date',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedReviewSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/plan/A1234BC/39e5a1a9-0f69-466c-8223-18a2e1cb2d78/review',
      expectedErrors,
    )
  })
})
