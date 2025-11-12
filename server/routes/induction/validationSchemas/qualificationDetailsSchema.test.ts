import { Request, Response } from 'express'
import type { Session } from 'express-session'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import qualificationDetailsSchema from './qualificationDetailsSchema'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import type { Error } from '../../../filters/findErrorFilter'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'

jest.mock('../../../data/session/prisonerContexts', () => ({
  getPrisonerContext: jest.fn(),
}))

describe('qualificationDetailsSchema', () => {
  const prisonerSummary = aValidPrisonerSummary()
  const prisonNumber = 'A1234BC'

  const req = {
    originalUrl: '',
    body: {},
    flash: jest.fn(),
    params: { prisonNumber },
    session: {} as Session,
  } as unknown as Request
  const res = {
    locals: { prisonerSummary },
    redirectWithErrors: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.originalUrl = '/prisoners/A1234BC/create-induction/12345/qualification-details'
    ;(getPrisonerContext as jest.Mock).mockReturnValue({
      qualificationLevelForm: { qualificationLevel: 'LEVEL_3' },
    })
  })

  it('happy path - validation passes with valid qualification details', async () => {
    // Given
    req.body = {
      qualificationSubject: 'Mathematics',
      qualificationGrade: 'A',
    }

    const expectedTransformedRequestBody = {
      qualificationSubject: 'Mathematics',
      qualificationGrade: 'A',
    }

    // When
    await validate(qualificationDetailsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(expectedTransformedRequestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it('sad path - validation fails when qualificationSubject is missing', async () => {
    // Given
    req.body = {
      qualificationGrade: 'A',
    }

    const expectedErrors: Array<Error> = [
      {
        href: '#qualificationSubject',
        text: `Enter the subject of Ifereeca Peigh's level 3 qualification`,
      },
    ]
    const expectedInvalidForm = JSON.stringify(req.body)

    // When
    await validate(qualificationDetailsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual({ qualificationGrade: 'A' })
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/qualification-details',
      expectedErrors,
    )
  })

  it('sad path - validation fails when qualificationGrade is missing', async () => {
    // Given
    req.body = {
      qualificationSubject: 'Mathematics',
    }

    const expectedErrors: Array<Error> = [
      {
        href: '#qualificationGrade',
        text: `Enter the grade of Ifereeca Peigh's level 3 qualification`,
      },
    ]
    const expectedInvalidForm = JSON.stringify(req.body)

    // When
    await validate(qualificationDetailsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual({ qualificationSubject: 'Mathematics' })
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/qualification-details',
      expectedErrors,
    )
  })

  it('sad path - validation fails when qualificationSubject exceeds maximum length', async () => {
    // Given
    const longSubject = 'a'.repeat(101)
    req.body = {
      qualificationSubject: longSubject,
      qualificationGrade: 'A',
    }

    const expectedErrors: Array<Error> = [
      {
        href: '#qualificationSubject',
        text: 'Subject must be 100 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(req.body)

    // When
    await validate(qualificationDetailsSchema)(req, res, next)

    // Then
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/qualification-details',
      expectedErrors,
    )
  })

  it('sad path - validation fails when qualificationGrade exceeds maximum length', async () => {
    // Given
    const longGrade = 'a'.repeat(51)
    req.body = {
      qualificationSubject: 'Mathematics',
      qualificationGrade: longGrade,
    }

    const expectedErrors: Array<Error> = [
      {
        href: '#qualificationGrade',
        text: 'Grade must be 50 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(req.body)

    // When
    await validate(qualificationDetailsSchema)(req, res, next)

    // Then
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/qualification-details',
      expectedErrors,
    )
  })

  it('sad path - validation fails when both fields are missing', async () => {
    // Given
    req.body = {}

    const expectedErrors: Array<Error> = [
      {
        href: '#qualificationSubject',
        text: `Enter the subject of Ifereeca Peigh's level 3 qualification`,
      },
      {
        href: '#qualificationGrade',
        text: `Enter the grade of Ifereeca Peigh's level 3 qualification`,
      },
    ]
    const expectedInvalidForm = JSON.stringify(req.body)

    // When
    await validate(qualificationDetailsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual({})
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/qualification-details',
      expectedErrors,
    )
  })

  it('uses correct formatting for different qualification levels', async () => {
    // Given
    ;(getPrisonerContext as jest.Mock).mockReturnValue({
      qualificationLevelForm: { qualificationLevel: 'ENTRY_LEVEL' },
    })
    req.body = {}

    const expectedErrors: Array<Error> = [
      {
        href: '#qualificationSubject',
        text: `Enter the subject of Ifereeca Peigh's entry level qualification`,
      },
      {
        href: '#qualificationGrade',
        text: `Enter the grade of Ifereeca Peigh's entry level qualification`,
      },
    ]
    const expectedInvalidForm = JSON.stringify(req.body)

    // When
    await validate(qualificationDetailsSchema)(req, res, next)

    // Then
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/qualification-details',
      expectedErrors,
    )
  })
})
