import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { ReviewExemptionForm } from 'reviewPlanForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import ExemptionReasonController from './exemptionReasonController'
import aValidReviewExemptionDto from '../../../testsupport/reviewExemptionDtoTestDataBuilder'
import ReviewScheduleStatusValue from '../../../enums/reviewScheduleStatusValue'

describe('exemptionReasonController', () => {
  const controller = new ExemptionReasonController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonId = 'MDI'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber, prisonId })

  const req = {
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber, journeyId },
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
    req.journeyData = {}
    res.locals.invalidForm = undefined
  })

  describe('getExemptionReasonView', () => {
    it(`should get 'exemption reason' view given dto is already on the prisoner context`, async () => {
      // Given
      const reviewExemptionDto = aValidReviewExemptionDto({
        exemptionReason: ReviewScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
        exemptionReasonDetails: 'In treatment',
      })
      req.journeyData.reviewExemptionDto = reviewExemptionDto

      const expectedForm: ReviewExemptionForm = {
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
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/exemption/exemptionReason/index', expectedView)
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

      const reviewExemptionDto = aValidReviewExemptionDto({
        prisonNumber,
        prisonId,
        exemptionReason: ReviewScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
        exemptionReasonDetails: 'In treatment',
      })

      // When
      await controller.submitExemptionReasonForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/A1234BC/${journeyId}/review/exemption/confirm`)
      expect(res.locals.invalidForm).toBeUndefined()
      expect(req.journeyData.reviewExemptionDto).toEqual(reviewExemptionDto)
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

      const expectedReviewExemptionDto = aValidReviewExemptionDto({
        prisonNumber,
        prisonId,
        exemptionReason: ReviewScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
        exemptionReasonDetails: 'In treatment',
      })

      // When
      await controller.submitExemptionReasonForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/A1234BC/${journeyId}/review/exemption/confirm`)
      expect(req.journeyData.reviewExemptionDto).toEqual(expectedReviewExemptionDto)
    })
  })
})
