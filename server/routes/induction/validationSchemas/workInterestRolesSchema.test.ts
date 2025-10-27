import { Request, Response } from 'express'
import workInterestRolesSchema from './workInterestRolesSchema'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import type { Error } from '../../../filters/findErrorFilter'

describe('workInterestRolesSchema', () => {
  const req = {
    originalUrl: '',
    body: {},
    flash: jest.fn(),
  } as unknown as Request
  const res = {
    locals: {},
    redirectWithErrors: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.originalUrl = '/prisoners/A1234BC/create-induction/12345/work-interest-roles'
  })

  it.each([
    {
      workInterestRoles: {},
      workInterestTypesOther: undefined,
    },
    {
      workInterestRoles: { RETAIL: undefined },
      workInterestTypesOther: undefined,
    },
    {
      workInterestRoles: {
        RETAIL: undefined,
        OTHER: 'TV Producer',
      },
      workInterestTypesOther: 'Film, TV and media',
    },
  ])(
    'happy path - validation passes - workInterestRoles: $workInterestRoles, workInterestTypesOther: $workInterestTypesOther',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedTransformedRequestBody = {
        workInterestRoles: requestBody.workInterestRoles,
        workInterestTypesOther: requestBody.workInterestTypesOther,
      }

      // When
      await validate(workInterestRolesSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(expectedTransformedRequestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it('sad path - job role value exceeds length', async () => {
    // Given
    const requestBody = {
      workInterestRoles: {
        RETAIL: undefined as string, // expect to pass as job type value is optional
        CONSTRUCTION: 'a'.repeat(513), // expect to fail as job type value exceeds length
        SPORTS: 'Fitness instructor', // expect to pass as job type value is within length
        OTHER: 'a'.repeat(513), // expect to fail as job type value exceeds length
      },
      workInterestTypesOther: 'Film, TV and media',
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      { href: '#CONSTRUCTION', text: 'The Construction and trade job role must be 512 characters or less' },
      { href: '#OTHER', text: 'The Film, TV and media job role must be 512 characters or less' },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(workInterestRolesSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/create-induction/12345/work-interest-roles',
      expectedErrors,
    )
  })
})
