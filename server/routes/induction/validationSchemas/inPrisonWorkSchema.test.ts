import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import inPrisonWorkSchema from './inPrisonWorkSchema'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import type { Error } from '../../../filters/findErrorFilter'

describe('inPrisonWorkSchema', () => {
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
    req.originalUrl = '/prisoners/A1234BC/create-induction/12345/in-prison-work'
  })

  it.each([
    { inPrisonWork: ['OTHER'], inPrisonWorkOther: 'Gardener' },
    { inPrisonWork: ['PRISON_LAUNDRY'], inPrisonWorkOther: '' },
    { inPrisonWork: ['PRISON_LAUNDRY'], inPrisonWorkOther: undefined },
    { inPrisonWork: ['PRISON_LAUNDRY', 'OTHER'], inPrisonWorkOther: 'Gardener' },
  ])(
    'happy path - validation passes - inPrisonWork: $inPrisonWork, inPrisonWorkOther: $inPrisonWorkOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedTransformedRequestBody = {
        inPrisonWork: Array.isArray(requestBody.inPrisonWork) ? requestBody.inPrisonWork : [requestBody.inPrisonWork],
        inPrisonWorkOther: requestBody.inPrisonWorkOther,
      }

      // When
      await validate(inPrisonWorkSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(expectedTransformedRequestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it.each([
    { inPrisonWork: [], inPrisonWorkOther: 'Gardener' },
    { inPrisonWork: [], inPrisonWorkOther: '' },
    { inPrisonWork: [], inPrisonWorkOther: undefined },
    { inPrisonWork: ['a-non-supported-value'], inPrisonWorkOther: undefined },
    { inPrisonWork: ['PRISON_L'], inPrisonWorkOther: undefined },
    { inPrisonWork: ['PRISON_LAUNDRY', 'a-non-supported-value'], inPrisonWorkOther: undefined },
  ])(
    'sad path - validation of inPrisonWork field fails - inPrisonWork: $inPrisonWork, inPrisonWorkOther: $inPrisonWorkOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#inPrisonWork',
          text: `Select the type of work Ifereeca Peigh would like to do in prison`,
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(inPrisonWorkSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/in-prison-work',
        expectedErrors,
      )
    },
  )

  it.each([
    { inPrisonWork: 'OTHER', inPrisonWorkOther: '' },
    { inPrisonWork: 'OTHER', inPrisonWorkOther: undefined },
    { inPrisonWork: ['PRISON_LAUNDRY', 'OTHER'], inPrisonWorkOther: '' },
    { inPrisonWork: ['PRISON_LAUNDRY', 'OTHER'], inPrisonWorkOther: undefined },
  ])(
    'sad path - validation of inPrisonWorkOther field fails - inPrisonWork: $inPrisonWork, inPrisonWorkOther: $inPrisonWorkOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        { href: '#inPrisonWorkOther', text: 'Enter the type of work Ifereeca Peigh would like to do in prison' },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(inPrisonWorkSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/in-prison-work',
        expectedErrors,
      )
    },
  )

  it('sad path - inPrisonWorkOther exceeds length', async () => {
    // Given
    const requestBody = { inPrisonWork: 'OTHER', inPrisonWorkOther: 'a'.repeat(256) }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      { href: '#inPrisonWorkOther', text: 'The type of work must be 255 characters or less' },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(inPrisonWorkSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/in-prison-work',
      expectedErrors,
    )
  })
})
