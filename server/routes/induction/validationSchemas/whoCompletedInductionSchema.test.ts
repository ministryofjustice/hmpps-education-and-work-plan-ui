import { Request, Response } from 'express'
import { addDays, format, startOfToday, subDays } from 'date-fns'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import whoCompletedInductionSchema from './whoCompletedInductionSchema'
import type { Error } from '../../../filters/findErrorFilter'

describe('whoCompletedInductionSchema', () => {
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
    req.originalUrl = '/prisoners/A1234BC/create-induction/12345/who-completed-induction'
  })

  it.each([
    {
      completedBy: 'MYSELF',
      completedByOtherFullName: undefined,
      completedByOtherJobRole: undefined,
      inductionDate: today,
    },
    {
      completedBy: 'MYSELF',
      completedByOtherFullName: undefined,
      completedByOtherJobRole: undefined,
      inductionDate: yesterday,
    },
    {
      completedBy: 'SOMEBODY_ELSE',
      completedByOtherFullName: 'Joe Bloggs',
      completedByOtherJobRole: 'Peer mentor',
      inductionDate: yesterday,
    },
  ])(
    'happy path - validation passes - completedBy: $completedBy, completedByOtherFullName: $completedByOtherFullName, completedByOtherJobRole: $completedByOtherJobRole, inductionDate: $inductionDate',
    async requestBody => {
      // Given
      req.body = requestBody

      // When
      await validate(whoCompletedInductionSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it.each([
    //
    { completedBy: 'a-non-supported-value', inductionDate: yesterday },
    { completedBy: null, inductionDate: yesterday },
    { completedBy: undefined, inductionDate: yesterday },
    { completedBy: '', inductionDate: yesterday },
  ])('sad path - completedBy field validation fails - %s', async requestBody => {
    // Given
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#completedBy',
        text: `Select who completed the induction`,
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedInductionSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/who-completed-induction',
      expectedErrors,
    )
  })

  it('sad path - mandatory completedByOtherFullName field validation fails', async () => {
    // Given
    const requestBody = {
      completedBy: 'SOMEBODY_ELSE',
      completedByOtherFullName: undefined as string,
      completedByOtherJobRole: 'Peer mentor',
      inductionDate: yesterday,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#completedByOtherFullName',
        text: 'Enter the full name of the person who completed the induction',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedInductionSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/who-completed-induction',
      expectedErrors,
    )
  })

  it('sad path - completedByOtherFullName field length validation fails', async () => {
    // Given
    const requestBody = {
      completedBy: 'SOMEBODY_ELSE',
      completedByOtherFullName: 'a'.repeat(201),
      completedByOtherJobRole: 'Peer mentor',
      inductionDate: yesterday,
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
    await validate(whoCompletedInductionSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/who-completed-induction',
      expectedErrors,
    )
  })

  it('sad path - mandatory completedByOtherJobRole field validation fails', async () => {
    // Given
    const requestBody = {
      completedBy: 'SOMEBODY_ELSE',
      completedByOtherFullName: 'Joe Bloggs',
      completedByOtherJobRole: undefined as string,
      inductionDate: yesterday,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#completedByOtherJobRole',
        text: 'Enter the job title of the person who completed the induction',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedInductionSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/who-completed-induction',
      expectedErrors,
    )
  })

  it('sad path - completedByOtherJobRole field length validation fails', async () => {
    // Given
    const requestBody = {
      completedBy: 'SOMEBODY_ELSE',
      completedByOtherFullName: 'Joe Bloggs',
      completedByOtherJobRole: 'a'.repeat(201),
      inductionDate: yesterday,
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
    await validate(whoCompletedInductionSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/who-completed-induction',
      expectedErrors,
    )
  })

  it('sad path - mandatory completedByOtherJobRole and completedByOtherFullName fields validation fails', async () => {
    // Given
    const requestBody = {
      completedBy: 'SOMEBODY_ELSE',
      completedByOtherFullName: undefined as string,
      completedByOtherJobRole: undefined as string,
      inductionDate: yesterday,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#completedByOtherFullName',
        text: 'Enter the full name of the person who completed the induction',
      },
      {
        href: '#completedByOtherJobRole',
        text: 'Enter the job title of the person who completed the induction',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedInductionSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/who-completed-induction',
      expectedErrors,
    )
  })

  it('sad path - future dated inductionDate field validation fails', async () => {
    // Given
    const requestBody = {
      completedBy: 'MYSELF',
      completedByOtherFullName: undefined as string,
      completedByOtherJobRole: undefined as string,
      inductionDate: tomorrow,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#inductionDate',
        text: 'Enter a valid date. Date cannot be in the future',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedInductionSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/who-completed-induction',
      expectedErrors,
    )
  })

  it('sad path - missing inductionDate field validation fails', async () => {
    // Given
    const requestBody = {
      completedBy: 'MYSELF',
      completedByOtherFullName: undefined as string,
      completedByOtherJobRole: undefined as string,
      inductionDate: undefined as string,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#inductionDate',
        text: 'Enter a valid date',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedInductionSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/who-completed-induction',
      expectedErrors,
    )
  })

  it.each([
    'today',
    '2024-01-01', // invalid against the configured patten in the schema
    '1/13/2024', // invalid against the configured patten in the schema
    '1 Feb 2024',
    '1/2/24',
  ])('sad path - invalid inductionDate field validation fails - %s', async inductionDate => {
    // Given
    const requestBody = {
      completedBy: 'MYSELF',
      completedByOtherFullName: undefined as string,
      completedByOtherJobRole: undefined as string,
      inductionDate,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#inductionDate',
        text: 'Enter a valid date',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedInductionSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/who-completed-induction',
      expectedErrors,
    )
  })
})
