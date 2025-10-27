import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import highestLevelOfEducationSchema from './highestLevelOfEducationSchema'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import type { Error } from '../../../filters/findErrorFilter'

describe('highestLevelOfEducationSchema', () => {
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
    req.originalUrl = '/prisoners/A1234BC/create-induction/12345/highest-level-of-education'
  })

  it.each([
    { educationLevel: 'PRIMARY_SCHOOL' },
    { educationLevel: 'SECONDARY_SCHOOL_LEFT_BEFORE_TAKING_EXAMS' },
    { educationLevel: 'SECONDARY_SCHOOL_TOOK_EXAMS' },
    { educationLevel: 'FURTHER_EDUCATION_COLLEGE' },
    { educationLevel: 'UNDERGRADUATE_DEGREE_AT_UNIVERSITY' },
    { educationLevel: 'POSTGRADUATE_DEGREE_AT_UNIVERSITY' },
    { educationLevel: 'NO_FORMAL_EDUCATION' },
    { educationLevel: 'NOT_SURE' },
  ])('happy path - validation passes - educationLevel: $educationLevel', async requestBody => {
    // Given
    req.body = requestBody

    const expectedTransformedRequestBody = {
      educationLevel: requestBody.educationLevel,
    }

    // When
    await validate(highestLevelOfEducationSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(expectedTransformedRequestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    { educationLevel: 'a-non-supported-value' },
    { educationLevel: 'PRIMARY' },
    { educationLevel: null },
    { educationLevel: undefined },
    { educationLevel: '' },
  ])('sad path - validation of educationLevel field fails - educationLevel: $educationLevel', async requestBody => {
    // Given
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#educationLevel',
        text: `Select Ifereeca Peigh's highest level of education`,
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(highestLevelOfEducationSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/highest-level-of-education',
      expectedErrors,
    )
  })
})
