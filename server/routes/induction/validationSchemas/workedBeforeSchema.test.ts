import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import workedBeforeSchema from './workedBeforeSchema'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import type { Error } from '../../../filters/findErrorFilter'

describe('workedBeforeSchema', () => {
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
    req.originalUrl = '/prisoners/A1234BC/create-induction/12345/has-worked-before'
  })

  it.each([
    { hasWorkedBefore: 'YES', hasWorkedBeforeNotRelevantReason: undefined },
    { hasWorkedBefore: 'YES', hasWorkedBeforeNotRelevantReason: null },
    { hasWorkedBefore: 'YES', hasWorkedBeforeNotRelevantReason: '' },
    { hasWorkedBefore: 'NO', hasWorkedBeforeNotRelevantReason: undefined },
    { hasWorkedBefore: 'NO', hasWorkedBeforeNotRelevantReason: null },
    { hasWorkedBefore: 'NO', hasWorkedBeforeNotRelevantReason: '' },
    { hasWorkedBefore: 'NOT_RELEVANT', hasWorkedBeforeNotRelevantReason: 'Long term disability' },
  ])(
    'happy path - validation passes - hasWorkedBefore: $hasWorkedBefore, hasWorkedBeforeNotRelevantReason: $hasWorkedBeforeNotRelevantReason',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedTransformedRequestBody = {
        hasWorkedBefore: requestBody.hasWorkedBefore,
        hasWorkedBeforeNotRelevantReason: requestBody.hasWorkedBeforeNotRelevantReason,
      }

      // When
      await validate(workedBeforeSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(expectedTransformedRequestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it.each([
    { hasWorkedBefore: '', hasWorkedBeforeNotRelevantReason: '' },
    { hasWorkedBefore: undefined, hasWorkedBeforeNotRelevantReason: '' },
    { hasWorkedBefore: null, hasWorkedBeforeNotRelevantReason: undefined },
    { hasWorkedBefore: 'a-non-supported-value', hasWorkedBeforeNotRelevantReason: undefined },
    { hasWorkedBefore: 'Y', hasWorkedBeforeNotRelevantReason: undefined },
    { hasWorkedBefore: 'Yes', hasWorkedBeforeNotRelevantReason: undefined },
    { hasWorkedBefore: 'N', hasWorkedBeforeNotRelevantReason: undefined },
    { hasWorkedBefore: 'No', hasWorkedBeforeNotRelevantReason: undefined },
    { hasWorkedBefore: 'true', hasWorkedBeforeNotRelevantReason: undefined },
    { hasWorkedBefore: 'false', hasWorkedBeforeNotRelevantReason: undefined },
  ])(
    'sad path - validation of hasWorkedBefore field fails - hasWorkedBefore: $hasWorkedBefore, hasWorkedBeforeNotRelevantReason: $hasWorkedBeforeNotRelevantReason',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#hasWorkedBefore',
          text: 'Select whether Ifereeca Peigh has worked before or not',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(workedBeforeSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/has-worked-before',
        expectedErrors,
      )
    },
  )

  it.each([
    { hasWorkedBefore: 'NOT_RELEVANT', hasWorkedBeforeNotRelevantReason: '' },
    { hasWorkedBefore: 'NOT_RELEVANT', hasWorkedBeforeNotRelevantReason: null },
    { hasWorkedBefore: 'NOT_RELEVANT', hasWorkedBeforeNotRelevantReason: undefined },
  ])(
    'sad path - validation of hasWorkedBeforeNotRelevantReason field fails - hasWorkedBefore: $hasWorkedBefore, hasWorkedBeforeNotRelevantReason: $hasWorkedBeforeNotRelevantReason',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        { href: '#hasWorkedBeforeNotRelevantReason', text: 'Enter the reason why not relevant' },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(workedBeforeSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/has-worked-before',
        expectedErrors,
      )
    },
  )

  it('sad path - hasWorkedBeforeNotRelevantReason exceeds length', async () => {
    // Given
    const requestBody = { hasWorkedBefore: 'NOT_RELEVANT', hasWorkedBeforeNotRelevantReason: 'a'.repeat(513) }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      { href: '#hasWorkedBeforeNotRelevantReason', text: 'The reason must be 512 characters or less' },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(workedBeforeSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/has-worked-before',
      expectedErrors,
    )
  })
})
