import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import workInterestTypesSchema from './workInterestTypesSchema'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import type { Error } from '../../../filters/findErrorFilter'

describe('workInterestTypesSchema', () => {
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
    req.originalUrl = '/prisoners/A1234BC/create-induction/12345/work-interest-types'
  })

  it.each([
    { workInterestTypes: ['OTHER'], workInterestTypesOther: 'Professional poker player' },
    { workInterestTypes: ['CLEANING_AND_MAINTENANCE'], workInterestTypesOther: '' },
    { workInterestTypes: ['CLEANING_AND_MAINTENANCE'], workInterestTypesOther: undefined },
    { workInterestTypes: ['DRIVING', 'OTHER'], workInterestTypesOther: 'Professional poker player' },
  ])(
    'happy path - validation passes - workInterestTypes: $workInterestTypes, workInterestTypesOther: $workInterestTypesOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedTransformedRequestBody = {
        workInterestTypes: Array.isArray(requestBody.workInterestTypes)
          ? requestBody.workInterestTypes
          : [requestBody.workInterestTypes],
        workInterestTypesOther: requestBody.workInterestTypesOther,
      }

      // When
      await validate(workInterestTypesSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(expectedTransformedRequestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it.each([
    { workInterestTypes: [], workInterestTypesOther: 'Professional poker player' },
    { workInterestTypes: [], workInterestTypesOther: '' },
    { workInterestTypes: [], workInterestTypesOther: undefined },
    { workInterestTypes: ['a-non-supported-value'], workInterestTypesOther: undefined },
    { workInterestTypes: ['CLEANING'], workInterestTypesOther: undefined },
    { workInterestTypes: ['DRIVING', 'a-non-supported-value'], workInterestTypesOther: undefined },
  ])(
    'sad path - validation of workInterestTypes field fails - workInterestTypes: $workInterestTypes, workInterestTypesOther: $workInterestTypesOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#workInterestTypes',
          text: 'Select the type of work Ifereeca Peigh is interested in',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(workInterestTypesSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/work-interest-types',
        expectedErrors,
      )
    },
  )

  it.each([
    { workInterestTypes: ['OTHER'], workInterestTypesOther: '' },
    { workInterestTypes: ['OTHER'], workInterestTypesOther: undefined },
    { workInterestTypes: ['DRIVING', 'OTHER'], workInterestTypesOther: '' },
    { workInterestTypes: ['DRIVING', 'OTHER'], workInterestTypesOther: undefined },
  ])(
    'sad path - validation of workInterestTypesOther field fails - workInterestTypes: $workInterestTypes, workInterestTypesOther: $workInterestTypesOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        { href: '#workInterestTypesOther', text: 'Enter the type of work Ifereeca Peigh is interested in' },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(workInterestTypesSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/work-interest-types',
        expectedErrors,
      )
    },
  )

  it('sad path - workInterestTypesOther exceeds length', async () => {
    // Given
    const requestBody = { workInterestTypes: 'OTHER', workInterestTypesOther: 'a'.repeat(256) }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      { href: '#workInterestTypesOther', text: 'The type of work must be 255 characters or less' },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(workInterestTypesSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/work-interest-types',
      expectedErrors,
    )
  })
})
