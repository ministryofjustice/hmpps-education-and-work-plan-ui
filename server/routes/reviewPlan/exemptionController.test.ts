import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import ExemptionReasonController from './exemptionController'

describe('exemptionReasonController', () => {
  const controller = new ExemptionReasonController()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

  const validForm = {
    exemptionReason: 'EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY',
    exemptionReasonDetails: {
      EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY: 'In treatment',
    },
  }
  const validFormMoreThanOneDetailsEntered = {
    exemptionReason: 'EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY',
    exemptionReasonDetails: {
      EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY: 'In treatment',
      EXEMPT_PRISONER_ESCAPED_OR_ABSCONDED: 'Prisoner is at large',
      EXEMPT_PRISONER_FAILED_TO_ENGAGE: 'Prisoner refuses to engage',
    },
  }
  const invalidFormNoExemptionReason = {
    exemptionReason: '',
    exemptionReasonDetails: {},
  }
  const invalidFormDetailsTooManyChars = {
    exemptionReason: 'EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY',
    exemptionReasonDetails: {
      EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY: 'a'.repeat(201),
    },
  }

  const req = {
    session: {},
    body: {},
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    getPrisonerContext(req.session, prisonNumber).exemptionReasonForm = undefined
  })

  describe('getExemptionReasonView', () => {
    it(`should get 'exemption reason' view given form is already on the prisoner context`, async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).exemptionReasonForm = validForm

      const expectedView = {
        prisonerSummary,
        form: validForm,
      }

      // When
      await controller.getExemptionReasonView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/exemption/index', expectedView)
    })
  })

  describe('submitExemptionReasonForm', () => {
    it('should redirect to overview page given form submitted successfully', async () => {
      // Given
      req.body = validForm

      // When
      await controller.submitExemptionReasonForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/view/overview')
      expect(getPrisonerContext(req.session, prisonNumber).exemptionReasonForm).toEqual(validForm)
    })

    it('should successfully submit the form with only the relevant exemption reason details given more than one has been entered', async () => {
      // Given
      req.body = validFormMoreThanOneDetailsEntered

      // When
      await controller.submitExemptionReasonForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/view/overview')
      expect(getPrisonerContext(req.session, prisonNumber).exemptionReasonForm.exemptionReason).toEqual(
        validForm.exemptionReason,
      )
      expect(
        getPrisonerContext(req.session, prisonNumber).exemptionReasonForm.exemptionReasonDetails[
          validFormMoreThanOneDetailsEntered.exemptionReason
        ],
      ).toEqual(validFormMoreThanOneDetailsEntered.exemptionReasonDetails.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY)
    })

    it('should redisplay page with relevant error message when no radio buttons have been selected', async () => {
      // Given
      req.body = invalidFormNoExemptionReason

      const expectedErrors = [
        { href: '#exemptionReason', text: 'Select an exemption reason to put the review on hold' },
      ]

      // When
      await controller.submitExemptionReasonForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/plan/A1234BC/review/exemption', expectedErrors)
      expect(getPrisonerContext(req.session, prisonNumber).exemptionReasonForm).toEqual(invalidFormNoExemptionReason)
    })

    it('should redisplay page with relevant error message when user exemption reason details exceeds 200 characters', async () => {
      // Given
      req.body = invalidFormDetailsTooManyChars

      const expectedErrors = [
        {
          href: '#EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY',
          text: 'Exemption details must be 200 characters or less',
        },
      ]

      // When
      await controller.submitExemptionReasonForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/plan/A1234BC/review/exemption', expectedErrors)
      expect(getPrisonerContext(req.session, prisonNumber).exemptionReasonForm).toEqual(invalidFormDetailsTooManyChars)
    })
  })
})
