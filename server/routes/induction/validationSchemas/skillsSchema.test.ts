import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import skillsSchema from './skillsSchema'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import type { Error } from '../../../filters/findErrorFilter'

describe('skillsSchema', () => {
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
    req.originalUrl = '/prisoners/A1234BC/create-induction/12345/skills'
  })

  it.each([
    { skills: 'OTHER', skillsOther: 'Circus skills' },
    { skills: 'POSITIVE_ATTITUDE', skillsOther: '' },
    { skills: 'POSITIVE_ATTITUDE', skillsOther: undefined },
    { skills: ['POSITIVE_ATTITUDE', 'OTHER'], skillsOther: 'Circus skills' },
    { skills: 'NONE', skillsOther: '' },
  ])('happy path - validation passes - skills: $skills, skillsOther: $skillsOther', async requestBody => {
    // Given
    req.body = requestBody

    const expectedTransformedRequestBody = {
      skills: Array.isArray(requestBody.skills) ? requestBody.skills : [requestBody.skills],
      skillsOther: requestBody.skillsOther,
    }

    // When
    await validate(skillsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(expectedTransformedRequestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    { skills: '', skillsOther: 'Circus skills' },
    { skills: undefined, skillsOther: '' },
    { skills: null, skillsOther: undefined },
    { skills: 'a-non-supported-value', skillsOther: undefined },
    { skills: 'WILLINGNESS_TO_L', skillsOther: undefined },
    { skills: ['POSITIVE_ATTITUDE', 'a-non-supported-value'], skillsOther: undefined },
    { skills: ['POSITIVE_ATTITUDE', 'NONE'], skillsOther: undefined },
  ])('sad path - validation of skills field fails - skills: $skills, skillsOther: $skillsOther', async requestBody => {
    // Given
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#skills',
        text: `Select the skills that Jimmy Lightfingers feels they have or select 'None of these'`,
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(skillsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/skills',
      expectedErrors,
    )
  })

  it.each([
    { skills: 'OTHER', skillsOther: '' },
    { skills: 'OTHER', skillsOther: undefined },
    { skills: ['POSITIVE_ATTITUDE', 'OTHER'], skillsOther: '' },
    { skills: ['POSITIVE_ATTITUDE', 'OTHER'], skillsOther: undefined },
  ])(
    'sad path - validation of skillsOther field fails - skills: $skills, skillsOther: $skillsOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        { href: '#skillsOther', text: 'Enter the skill that Jimmy Lightfingers feels they have' },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(skillsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/12345/skills',
        expectedErrors,
      )
    },
  )

  it('sad path - skillsOther exceeds length', async () => {
    // Given
    const requestBody = { skills: 'OTHER', skillsOther: 'a'.repeat(256) }
    req.body = requestBody

    const expectedErrors: Array<Error> = [{ href: '#skillsOther', text: 'The skill must be 255 characters or less' }]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(skillsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/skills',
      expectedErrors,
    )
  })
})
