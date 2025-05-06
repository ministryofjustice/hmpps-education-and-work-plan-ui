import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import hopingToWorkOnReleaseSchema from './hopingToWorkOnReleaseSchema'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import type { Error } from '../../../filters/findErrorFilter'

describe('hopingToWorkOnReleaseSchema', () => {
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
    req.originalUrl = '/prisoners/A1234BC/create-induction/12345/hoping-to-work-on-release'
  })

  it.each([
    //
    { hopingToGetWork: 'YES' },
    { hopingToGetWork: 'NO' },
    { hopingToGetWork: 'NOT_SURE' },
  ])('happy path - validation passes - %s', async requestBody => {
    // Given
    req.body = requestBody

    // When
    await validate(hopingToWorkOnReleaseSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    //
    { hopingToGetWork: 'a-non-supported-value' },
    { hopingToGetWork: 'Y' },
    { hopingToGetWork: null },
    { hopingToGetWork: undefined },
    { hopingToGetWork: '' },
  ])('sad path - validation fails - %s', async requestBody => {
    // Given
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#hopingToGetWork',
        text: `Select whether Jimmy Lightfingers is hoping to get work`,
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(hopingToWorkOnReleaseSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/hoping-to-work-on-release',
      expectedErrors,
    )
  })
})
