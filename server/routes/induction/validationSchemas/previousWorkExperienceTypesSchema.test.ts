import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import previousWorkExperienceTypesSchema from './previousWorkExperienceTypesSchema'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import type { Error } from '../../../filters/findErrorFilter'

describe('previousWorkExperienceTypesSchema', () => {
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
    req.originalUrl = '/prisoners/A1234BC/create-induction/12345/previous-work-experience'
  })

  it.each([
    { typeOfWorkExperience: ['OTHER'], typeOfWorkExperienceOther: 'Gardener' },
    { typeOfWorkExperience: ['RETAIL'], typeOfWorkExperienceOther: '' },
    { typeOfWorkExperience: ['RETAIL'], typeOfWorkExperienceOther: undefined },
    { typeOfWorkExperience: ['RETAIL', 'OTHER'], typeOfWorkExperienceOther: 'Gardener' },
  ])(
    'happy path - validation passes - typeOfWorkExperience: $typeOfWorkExperience, typeOfWorkExperienceOther: $typeOfWorkExperienceOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedTransformedRequestBody = {
        typeOfWorkExperience: Array.isArray(requestBody.typeOfWorkExperience)
          ? requestBody.typeOfWorkExperience
          : [requestBody.typeOfWorkExperience],
        typeOfWorkExperienceOther: requestBody.typeOfWorkExperienceOther,
      }

      // When
      await validate(previousWorkExperienceTypesSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(expectedTransformedRequestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it.each([
    { typeOfWorkExperience: [], typeOfWorkExperienceOther: 'Gardener' },
    { typeOfWorkExperience: [], typeOfWorkExperienceOther: '' },
    { typeOfWorkExperience: [], typeOfWorkExperienceOther: undefined },
    { typeOfWorkExperience: ['a-non-supported-value'], typeOfWorkExperienceOther: undefined },
    { typeOfWorkExperience: ['RETA'], typeOfWorkExperienceOther: undefined },
    { typeOfWorkExperience: ['RETAIL', 'a-non-supported-value'], typeOfWorkExperienceOther: undefined },
  ])(
    'sad path - validation of typeOfWorkExperience field fails - typeOfWorkExperience: $typeOfWorkExperience, typeOfWorkExperienceOther: $typeOfWorkExperienceOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#typeOfWorkExperience',
          text: 'Select the type of work Ifereeca Peigh has done before',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(previousWorkExperienceTypesSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/previous-work-experience',
        expectedErrors,
      )
    },
  )

  it.each([
    { typeOfWorkExperience: ['OTHER'], typeOfWorkExperienceOther: '' },
    { typeOfWorkExperience: ['OTHER'], typeOfWorkExperienceOther: undefined },
    { typeOfWorkExperience: ['RETAIL', 'OTHER'], typeOfWorkExperienceOther: '' },
    { typeOfWorkExperience: ['RETAIL', 'OTHER'], typeOfWorkExperienceOther: undefined },
  ])(
    'sad path - validation of typeOfWorkExperienceOther field fails - typeOfWorkExperience: $typeOfWorkExperience, typeOfWorkExperienceOther: $typeOfWorkExperienceOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        { href: '#typeOfWorkExperienceOther', text: 'Enter the type of work Ifereeca Peigh has done before' },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(previousWorkExperienceTypesSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/previous-work-experience',
        expectedErrors,
      )
    },
  )

  it('sad path - typeOfWorkExperienceOther exceeds length', async () => {
    // Given
    const requestBody = { typeOfWorkExperience: 'OTHER', typeOfWorkExperienceOther: 'a'.repeat(257) }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      { href: '#typeOfWorkExperienceOther', text: 'The type of work must be 256 characters or less' },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(previousWorkExperienceTypesSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/previous-work-experience',
      expectedErrors,
    )
  })
})
