import type { InductionExemptionForm } from 'inductionForms'
import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { getPrisonerContext } from '../../../../data/session/prisonerContexts'
import ExemptionReasonController from './exemptionReasonController'
import aValidInductionExemptionDto from '../../../../testsupport/inductionExemptionDtoTestDataBuilder'
import InductionScheduleStatusValue from '../../../../enums/inductionScheduleStatusValue'

describe('exemptionReasonController', () => {
  const controller = new ExemptionReasonController()
  const prisonNumber = 'A1234BC'
  const prisonId = 'MDI'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber, prisonId)

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
    getPrisonerContext(req.session, prisonNumber).inductionExemptionForm = undefined
  })

  describe('getExemptionReasonView', () => {
    it(`should get 'exemption reason' view given dto is already on the prisoner context`, async () => {
      // Given
      const inductionExemptionDto = aValidInductionExemptionDto({
        exemptionReason: InductionScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
        exemptionReasonDetails: 'In treatment',
      })
      getPrisonerContext(req.session, prisonNumber).inductionExemptionDto = inductionExemptionDto

      const expectedForm: InductionExemptionForm = {
        exemptionReason: 'EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY',
        exemptionReasonDetails: {
          EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY: 'In treatment',
        },
      }

      const expectedView = {
        prisonerSummary,
        form: expectedForm,
      }

      // When
      await controller.getExemptionReasonView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/exemption/exemptionReason/index', expectedView)
    })
  })

  describe('submitExemptionReasonForm', () => {
    it('should redirect to confirm exemption page given form submitted successfully', async () => {
      // Given
      const expectedExemptionReasonForm = {
        exemptionReason: 'EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY',
        exemptionReasonDetails: {
          EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY: 'In treatment',
        },
      }
      req.body = expectedExemptionReasonForm

      const inductionExemptionDto = aValidInductionExemptionDto({
        prisonNumber,
        prisonId,
        exemptionReason: InductionScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
        exemptionReasonDetails: 'In treatment',
      })

      // When
      await controller.submitExemptionReasonForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/exemption/confirm')
      expect(getPrisonerContext(req.session, prisonNumber).inductionExemptionForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).inductionExemptionDto).toEqual(inductionExemptionDto)
    })

    it('should successfully submit the form with only the relevant exemption reason details given more than one has been entered', async () => {
      // Given
      const expectedExemptionReason = 'EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY'
      const expectedExemptionReasonDetails = {
        EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY: 'In treatment',
        EXEMPT_PRISONER_ESCAPED_OR_ABSCONDED: 'Prisoner is at large',
        EXEMPT_PRISONER_FAILED_TO_ENGAGE: 'Prisoner refuses to engage',
      }
      const expectedExemptionReasonForm = {
        exemptionReason: expectedExemptionReason,
        exemptionReasonDetails: expectedExemptionReasonDetails,
      }
      req.body = expectedExemptionReasonForm

      const expectedInductionExemptionDto = aValidInductionExemptionDto({
        prisonNumber,
        prisonId,
        exemptionReason: InductionScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
        exemptionReasonDetails: 'In treatment',
      })

      // When
      await controller.submitExemptionReasonForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/exemption/confirm')
      expect(getPrisonerContext(req.session, prisonNumber).inductionExemptionDto).toEqual(expectedInductionExemptionDto)
    })

    it('should redisplay page with relevant error message when no radio buttons have been selected', async () => {
      // Given
      const expectedExemptionReasonForm = {
        exemptionReason: '',
        exemptionReasonDetails: {},
      }
      req.body = expectedExemptionReasonForm

      const expectedErrors = [
        { href: '#exemptionReason', text: 'Select an exemption reason to put the induction on hold' },
      ]

      // When
      await controller.submitExemptionReasonForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/prisoners/A1234BC/induction/exemption', expectedErrors)
      expect(getPrisonerContext(req.session, prisonNumber).inductionExemptionForm).toEqual(expectedExemptionReasonForm)
    })

    it('should redisplay page with relevant error message when user exemption reason details exceeds 200 characters', async () => {
      // Given
      const expectedExemptionReasonForm = {
        exemptionReason: 'EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY',
        exemptionReasonDetails: {
          EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY: 'a'.repeat(201),
        },
      }
      req.body = expectedExemptionReasonForm

      const expectedErrors = [
        {
          href: '#EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY',
          text: 'Exemption details must be 200 characters or less',
        },
      ]

      // When
      await controller.submitExemptionReasonForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/prisoners/A1234BC/induction/exemption', expectedErrors)
      expect(getPrisonerContext(req.session, prisonNumber).inductionExemptionForm).toEqual(expectedExemptionReasonForm)
    })
  })
})
