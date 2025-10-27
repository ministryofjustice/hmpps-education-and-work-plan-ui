import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import type { Error } from '../../../filters/findErrorFilter'
import additionalTrainingSchema from './additionalTrainingSchema'

describe('additionalTrainingSchema', () => {
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
    req.originalUrl = '/prisoners/A1234BC/create-induction/12345/additional-training'
  })

  it.each([
    { additionalTraining: ['OTHER'], additionalTrainingOther: 'Fire Safety Course' },
    { additionalTraining: ['CSCS_CARD'], additionalTrainingOther: '' },
    { additionalTraining: ['CSCS_CARD'], additionalTrainingOther: undefined },
    { additionalTraining: ['CSCS_CARD', 'OTHER'], additionalTrainingOther: 'Fire Safety Course' },
    { additionalTraining: ['NONE'], additionalTrainingOther: '' },
  ])(
    'happy path - validation passes - additionalTraining: $additionalTraining, additionalTrainingOther: $additionalTrainingOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedTransformedRequestBody = {
        additionalTraining: Array.isArray(requestBody.additionalTraining)
          ? requestBody.additionalTraining
          : [requestBody.additionalTraining],
        additionalTrainingOther: requestBody.additionalTrainingOther,
      }

      // When
      await validate(additionalTrainingSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(expectedTransformedRequestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it.each([
    { additionalTraining: [], additionalTrainingOther: 'Fire Safety Course' },
    { additionalTraining: [], additionalTrainingOther: '' },
    { additionalTraining: [], additionalTrainingOther: undefined },
    { additionalTraining: ['a-non-supported-value'], additionalTrainingOther: undefined },
    { additionalTraining: ['CSCS'], additionalTrainingOther: undefined },
    { additionalTraining: ['CSCS_CARD', 'a-non-supported-value'], additionalTrainingOther: undefined },
    { additionalTraining: ['CSCS_CARD', 'NONE'], additionalTrainingOther: undefined },
  ])(
    'sad path - validation of additionalTraining field fails - additionalTraining: $additionalTraining, additionalTrainingOther: $additionalTrainingOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#additionalTraining',
          text: 'Select the type of training or vocational qualification Ifereeca Peigh has',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(additionalTrainingSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/additional-training',
        expectedErrors,
      )
    },
  )

  it.each([
    { additionalTraining: 'OTHER', additionalTrainingOther: '' },
    { additionalTraining: 'OTHER', additionalTrainingOther: undefined },
    { additionalTraining: ['CSCS_CARD', 'OTHER'], additionalTrainingOther: '' },
    { additionalTraining: ['CSCS_CARD', 'OTHER'], additionalTrainingOther: undefined },
  ])(
    'sad path - validation of additionalTrainingOther field fails - additionalTraining: $additionalTraining, additionalTrainingOther: $additionalTrainingOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#additionalTrainingOther',
          text: 'Enter the type of training or vocational qualification Ifereeca Peigh has',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(additionalTrainingSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/additional-training',
        expectedErrors,
      )
    },
  )

  it('sad path - additionalTrainingOther exceeds length', async () => {
    // Given
    const requestBody = { additionalTraining: 'OTHER', additionalTrainingOther: 'a'.repeat(513) }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      { href: '#additionalTrainingOther', text: 'The type of training must be 512 characters or less' },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(additionalTrainingSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/additional-training',
      expectedErrors,
    )
  })
})
