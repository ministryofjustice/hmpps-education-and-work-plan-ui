import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import inPrisonTrainingSchema from './inPrisonTrainingSchema'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import type { Error } from '../../../filters/findErrorFilter'

describe('inPrisonTrainingSchema', () => {
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
    req.originalUrl = '/prisoners/A1234BC/create-induction/12345/in-prison-training'
  })

  it.each([
    { inPrisonTraining: ['OTHER'], inPrisonTrainingOther: 'Electrical work' },
    { inPrisonTraining: ['COMMUNICATION_SKILLS'], inPrisonTrainingOther: '' },
    { inPrisonTraining: ['COMMUNICATION_SKILLS'], inPrisonTrainingOther: undefined },
    { inPrisonTraining: ['COMMUNICATION_SKILLS', 'OTHER'], inPrisonTrainingOther: 'Electrical work' },
  ])(
    'happy path - validation passes - inPrisonTraining: $inPrisonTraining, inPrisonTrainingOther: $inPrisonTrainingOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedTransformedRequestBody = {
        inPrisonTraining: Array.isArray(requestBody.inPrisonTraining)
          ? requestBody.inPrisonTraining
          : [requestBody.inPrisonTraining],
        inPrisonTrainingOther: requestBody.inPrisonTrainingOther,
      }

      // When
      await validate(inPrisonTrainingSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(expectedTransformedRequestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it.each([
    { inPrisonTraining: [], inPrisonTrainingOther: 'Electrical work' },
    { inPrisonTraining: [], inPrisonTrainingOther: '' },
    { inPrisonTraining: [], inPrisonTrainingOther: undefined },
    { inPrisonTraining: ['a-non-supported-value'], inPrisonTrainingOther: undefined },
    { inPrisonTraining: ['COMMUNICATION'], inPrisonTrainingOther: undefined },
    { inPrisonTraining: ['COMMUNICATION_SKILLS', 'a-non-supported-value'], inPrisonTrainingOther: undefined },
  ])(
    'sad path - validation of inPrisonTraining field fails - inPrisonTraining: $inPrisonTraining, inPrisonTrainingOther: $inPrisonTrainingOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#inPrisonTraining',
          text: `Select the type of training Ifereeca Peigh would like to do in prison`,
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(inPrisonTrainingSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/in-prison-training',
        expectedErrors,
      )
    },
  )

  it.each([
    { inPrisonTraining: 'OTHER', inPrisonTrainingOther: '' },
    { inPrisonTraining: 'OTHER', inPrisonTrainingOther: undefined },
    { inPrisonTraining: ['COMMUNICATION_SKILLS', 'OTHER'], inPrisonTrainingOther: '' },
    { inPrisonTraining: ['COMMUNICATION_SKILLS', 'OTHER'], inPrisonTrainingOther: undefined },
  ])(
    'sad path - validation of inPrisonTrainingOther field fails - inPrisonTraining: $inPrisonTraining, inPrisonTrainingOther: $inPrisonTrainingOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#inPrisonTrainingOther',
          text: 'Enter the type of type of training Ifereeca Peigh would like to do in prison',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(inPrisonTrainingSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/in-prison-training',
        expectedErrors,
      )
    },
  )

  it('sad path - inPrisonTrainingOther exceeds length', async () => {
    // Given
    const requestBody = { inPrisonTraining: 'OTHER', inPrisonTrainingOther: 'a'.repeat(256) }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      { href: '#inPrisonTrainingOther', text: 'The type of training must be 255 characters or less' },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(inPrisonTrainingSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/in-prison-training',
      expectedErrors,
    )
  })
})
