import { Request, Response } from 'express'
import { InductionExemptionReason } from '../../../enums/inductionExemptionReasonValue'
import { validate } from '../../routerRequestHandlers/validationMiddleware'
import inductionExemptionSchema from './inductionExemptionSchema'
import type { Error } from '../../../filters/findErrorFilter'

describe('inductionExemptionSchema', () => {
  const req = {
    originalUrl: '',
    body: {},
    flash: jest.fn(),
  } as unknown as Request
  const res = {
    redirectWithErrors: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.originalUrl = '/prisoners/A1234BC/induction/39e5a1a9-0f69-466c-8223-18a2e1cb2d78/exemption'
  })

  it.each(
    InductionExemptionReason.map(exemptionReason => ({ exemptionReason })).concat(
      InductionExemptionReason.map(exemptionReason => ({
        exemptionReason,
        exemptionReasonDetails: { [exemptionReason]: 'A reason for the exemption' },
      })),
    ),
  )(
    'happy path - validation passes - exemptionReason: $exemptionReason, exemptionReasonDetails: $exemptionReasonDetails',
    async requestBody => {
      // Given
      req.body = requestBody

      // When
      await validate(inductionExemptionSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it.each([
    { exemptionReason: '' },
    { exemptionReason: undefined },
    { exemptionReason: null },
    { exemptionReason: 'a-non-supported-value' },
    { exemptionReason: 'EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPE' },
    { exemptionReason: 'SCHEDULED' }, // SCHEDULED is an induction status, but is not a reason exemption reason
  ])('sad path - validation of exemptionReason field fails - exemptionReason: $exemptionReason', async requestBody => {
    // Given
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#exemptionReason',
        text: 'Select an exemption reason to put the induction on hold',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(inductionExemptionSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/prisoners/A1234BC/induction/39e5a1a9-0f69-466c-8223-18a2e1cb2d78/exemption',
      expectedErrors,
    )
  })

  it.each(
    InductionExemptionReason.map(exemptionReason => ({
      exemptionReason,
      exemptionReasonDetails: { [exemptionReason]: 'a'.repeat(201) },
    })),
  )(
    'sad path - notes field length validation fails - exemptionReason: $exemptionReason, exemptionReasonDetails: $exemptionReasonDetails',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: `#${requestBody.exemptionReason}`,
          text: 'Exemption details must be 200 characters or less',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(inductionExemptionSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/induction/39e5a1a9-0f69-466c-8223-18a2e1cb2d78/exemption',
        expectedErrors,
      )
    },
  )
})
