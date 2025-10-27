import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import affectAbilityToWorkSchema from './affectAbilityToWorkSchema'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import type { Error } from '../../../filters/findErrorFilter'

describe('affectAbilityToWorkSchema', () => {
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
    req.originalUrl = '/prisoners/A1234BC/create-induction/12345/affect-ability-to-work'
  })

  it.each([
    { affectAbilityToWork: ['OTHER'], affectAbilityToWorkOther: 'Mental health' },
    { affectAbilityToWork: ['NO_RIGHT_TO_WORK'], affectAbilityToWorkOther: '' },
    { affectAbilityToWork: ['NO_RIGHT_TO_WORK'], affectAbilityToWorkOther: undefined },
    { affectAbilityToWork: ['NO_RIGHT_TO_WORK', 'OTHER'], affectAbilityToWorkOther: 'Mental health' },
    { affectAbilityToWork: ['NONE'], affectAbilityToWorkOther: '' },
  ])(
    'happy path - validation passes - affectAbilityToWork: $affectAbilityToWork, affectAbilityToWorkOther: $affectAbilityToWorkOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedTransformedRequestBody = {
        affectAbilityToWork: Array.isArray(requestBody.affectAbilityToWork)
          ? requestBody.affectAbilityToWork
          : [requestBody.affectAbilityToWork],
        affectAbilityToWorkOther: requestBody.affectAbilityToWorkOther,
      }

      // When
      await validate(affectAbilityToWorkSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(expectedTransformedRequestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it.each([
    { affectAbilityToWork: [], affectAbilityToWorkOther: 'Mental health' },
    { affectAbilityToWork: [], affectAbilityToWorkOther: '' },
    { affectAbilityToWork: [], affectAbilityToWorkOther: undefined },
    { affectAbilityToWork: ['a-non-supported-value'], affectAbilityToWorkOther: undefined },
    { affectAbilityToWork: ['NO_RIGHT'], affectAbilityToWorkOther: undefined },
    { affectAbilityToWork: ['NO_RIGHT_TO_WORK', 'a-non-supported-value'], affectAbilityToWorkOther: undefined },
    { affectAbilityToWork: ['NO_RIGHT_TO_WORK', 'NONE'], affectAbilityToWorkOther: undefined },
  ])(
    'sad path - validation of affectAbilityToWork field fails - affectAbilityToWork: $affectAbilityToWork, affectAbilityToWorkOther: $affectAbilityToWorkOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#affectAbilityToWork',
          text: `Select factors affecting Ifereeca Peigh's ability to work or select 'None of these'`,
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(affectAbilityToWorkSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/affect-ability-to-work',
        expectedErrors,
      )
    },
  )

  it.each([
    { affectAbilityToWork: ['OTHER'], affectAbilityToWorkOther: '' },
    { affectAbilityToWork: ['OTHER'], affectAbilityToWorkOther: undefined },
    { affectAbilityToWork: ['NO_RIGHT_TO_WORK', 'OTHER'], affectAbilityToWorkOther: '' },
    { affectAbilityToWork: ['NO_RIGHT_TO_WORK', 'OTHER'], affectAbilityToWorkOther: undefined },
  ])(
    'sad path - validation of affectAbilityToWorkOther field fails - affectAbilityToWork: $affectAbilityToWork, affectAbilityToWorkOther: $affectAbilityToWorkOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        { href: '#affectAbilityToWorkOther', text: `Enter factors affecting Ifereeca Peigh's ability to work` },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(affectAbilityToWorkSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/affect-ability-to-work',
        expectedErrors,
      )
    },
  )

  it('sad path - affectAbilityToWorkOther exceeds length', async () => {
    // Given
    const requestBody = { affectAbilityToWork: 'OTHER', affectAbilityToWorkOther: 'a'.repeat(513) }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#affectAbilityToWorkOther',
        text: 'The factors affecting ability to work must be 512 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(affectAbilityToWorkSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/affect-ability-to-work',
      expectedErrors,
    )
  })
})
