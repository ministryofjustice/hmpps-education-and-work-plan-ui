import { Request, Response } from 'express'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import archiveGoalSchema from './archiveGoalSchema'
import type { Error } from '../../../filters/findErrorFilter'

describe('archiveGoalSchema', () => {
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
    req.originalUrl = '/plan/A1234BC/goals/12345/archive'
  })

  it.each([
    { reason: 'PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL', reasonOther: null },
    { reason: 'PRISONER_NO_LONGER_WANTS_TO_WORK_WITH_CIAG', reasonOther: null },
    { reason: 'SUITABLE_ACTIVITIES_NOT_AVAILABLE_IN_THIS_PRISON', reasonOther: '' },
    { reason: 'SUITABLE_ACTIVITIES_NOT_AVAILABLE_IN_THIS_PRISON', reasonOther: undefined },
    { reason: 'SUITABLE_ACTIVITIES_NOT_AVAILABLE_IN_THIS_PRISON', reasonOther: null },
    { reason: 'OTHER', reasonOther: 'Some other reason for archiving the goal' },
  ])('happy path - validation passes - reason: $reason, reasonOther: $reasonOther', async requestBody => {
    // Given
    req.body = requestBody

    // When
    await validate(archiveGoalSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it('sad path - mandatory reason field validation fails', async () => {
    // Given
    const requestBody = {}
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#reason',
        text: 'Select a reason to archive the goal',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(archiveGoalSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith('/plan/A1234BC/goals/12345/archive', expectedErrors)
  })

  it('sad path - mandatory reasonOther field validation fails when reason is OTHER', async () => {
    // Given
    const requestBody = {
      reason: 'OTHER',
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#reasonOther',
        text: 'Enter the reason you are archiving the goal',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(archiveGoalSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith('/plan/A1234BC/goals/12345/archive', expectedErrors)
  })

  it('sad path - reasonOther field validation fails max length when reason is OTHER', async () => {
    // Given
    const requestBody = {
      reason: 'OTHER',
      reasonOther: 'a'.repeat(201),
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#reasonOther',
        text: 'The reason must be 200 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(archiveGoalSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith('/plan/A1234BC/goals/12345/archive', expectedErrors)
  })
})
