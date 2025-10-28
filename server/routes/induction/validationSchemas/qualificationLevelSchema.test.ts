import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import qualificationLevelSchema from './qualificationLevelSchema'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import type { Error } from '../../../filters/findErrorFilter'

describe('qualificationLevelSchema', () => {
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
    req.originalUrl = '/prisoners/A1234BC/create-induction/12345/qualification-level'
  })

  it.each([
    { qualificationLevel: 'ENTRY_LEVEL' },
    { qualificationLevel: 'LEVEL_1' },
    { qualificationLevel: 'LEVEL_2' },
    { qualificationLevel: 'LEVEL_3' },
    { qualificationLevel: 'LEVEL_4' },
    { qualificationLevel: 'LEVEL_5' },
    { qualificationLevel: 'LEVEL_6' },
    { qualificationLevel: 'LEVEL_7' },
    { qualificationLevel: 'LEVEL_8' },
  ])('happy path - validation passes - qualificationLevel: $qualificationLevel', async requestBody => {
    // Given
    req.body = requestBody

    const expectedTransformedRequestBody = {
      qualificationLevel: requestBody.qualificationLevel,
    }

    // When
    await validate(qualificationLevelSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(expectedTransformedRequestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    { qualificationLevel: 'a-non-supported-value' },
    { qualificationLevel: 'LEVEL_9' },
    { qualificationLevel: null },
    { qualificationLevel: undefined },
    { qualificationLevel: '' },
  ])(
    'sad path - validation of qualificationLevel field fails - qualificationLevel: $qualificationLevel',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#qualificationLevel',
          text: `Select the level of qualification Ifereeca Peigh wants to add`,
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(qualificationLevelSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/qualification-level',
        expectedErrors,
      )
    },
  )
})
