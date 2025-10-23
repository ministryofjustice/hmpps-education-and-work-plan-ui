import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import personalInterestsSchema from './personalInterestsSchema'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import type { Error } from '../../../filters/findErrorFilter'

describe('personalInterestsSchema', () => {
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
    req.originalUrl = '/prisoners/A1234BC/create-induction/12345/personal-interests'
  })

  it.each([
    { personalInterests: 'OTHER', personalInterestsOther: 'Crypto currency' },
    { personalInterests: 'SOLO_ACTIVITIES', personalInterestsOther: '' },
    { personalInterests: 'SOLO_ACTIVITIES', personalInterestsOther: undefined },
    { personalInterests: ['SOLO_ACTIVITIES', 'OTHER'], personalInterestsOther: 'Crypto currency' },
    { personalInterests: 'NONE', personalInterestsOther: '' },
  ])(
    'happy path - validation passes - personalInterests: $personalInterests, personalInterestsOther: $personalInterestsOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedTransformedRequestBody = {
        personalInterests: Array.isArray(requestBody.personalInterests)
          ? requestBody.personalInterests
          : [requestBody.personalInterests],
        personalInterestsOther: requestBody.personalInterestsOther,
      }

      // When
      await validate(personalInterestsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(expectedTransformedRequestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it.each([
    { personalInterests: '', personalInterestsOther: 'Crypto currency' },
    { personalInterests: undefined, personalInterestsOther: '' },
    { personalInterests: null, personalInterestsOther: undefined },
    { personalInterests: 'a-non-supported-value', personalInterestsOther: undefined },
    { personalInterests: 'SOLO_ACTIV', personalInterestsOther: undefined },
    { personalInterests: ['SOLO_ACTIVITIES', 'a-non-supported-value'], personalInterestsOther: undefined },
    { personalInterests: ['SOLO_ACTIVITIES', 'NONE'], personalInterestsOther: undefined },
  ])(
    'sad path - validation of skills field fails - personalInterests: $personalInterests, personalInterestsOther: $personalInterestsOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#personalInterests',
          text: `Select Ifereeca Peigh's interests or select 'None of these'`,
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(personalInterestsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/personal-interests',
        expectedErrors,
      )
    },
  )

  it.each([
    { personalInterests: 'OTHER', personalInterestsOther: '' },
    { personalInterests: 'OTHER', personalInterestsOther: undefined },
    { personalInterests: ['SOLO_ACTIVITIES', 'OTHER'], personalInterestsOther: '' },
    { personalInterests: ['SOLO_ACTIVITIES', 'OTHER'], personalInterestsOther: undefined },
  ])(
    'sad path - validation of personalInterestsOther field fails - personalInterests: $personalInterests, personalInterestsOther: $personalInterestsOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        { href: '#personalInterestsOther', text: `Enter Ifereeca Peigh's interests` },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(personalInterestsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/personal-interests',
        expectedErrors,
      )
    },
  )

  it('sad path - personalInterestsOther exceeds length', async () => {
    // Given
    const requestBody = { personalInterests: 'OTHER', personalInterestsOther: 'a'.repeat(256) }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      { href: '#personalInterestsOther', text: 'The interests must be 255 characters or less' },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(personalInterestsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/personal-interests',
      expectedErrors,
    )
  })
})
