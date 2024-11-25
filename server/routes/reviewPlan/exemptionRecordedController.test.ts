import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import ExemptionRecordedController from './exemptionRecordedController'
import ExemptionRecordedView from './exemptionRecordedView'
import * as prisonerContexts from '../../data/session/prisonerContexts'

jest.mock('../../data/session/prisonerContexts')

describe('ExemptionRecordedController', () => {
  const controller = new ExemptionRecordedController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

  let req: Request
  let res: Response
  let next: jest.Mock

  beforeEach(() => {
    req = {
      params: { prisonNumber },
      session: {},
    } as unknown as Request

    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      redirectWithSuccess: jest.fn(),
      locals: { prisonerSummary },
    } as unknown as Response

    next = jest.fn()

    jest.clearAllMocks()
  })

  describe('getExemptionRecordedView', () => {
    it('should render the "Exemption Recorded" page', async () => {
      // Given
      const reviewExemptionDto = {
        exemptionReason: 'EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY',
        exemptionReasonDetails: 'In treatment',
      }

      const exemptionDueToTechnicalIssue = false
      jest.spyOn(prisonerContexts, 'getPrisonerContext').mockReturnValue({
        reviewExemptionDto,
      })

      const expectedViewData = new ExemptionRecordedView(prisonerSummary, exemptionDueToTechnicalIssue).renderArgs

      // When
      await controller.getExemptionRecordedView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/exemptionRecorded/index', expectedViewData)
    })
  })

  describe('Continue', () => {
    it('should redirect to the overview page with a success message when the Continue button is clicked', async () => {
      await controller.goToLearningAndWorkProgressPlan(req, res, next)

      // Then
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(
        `/plan/${prisonNumber}/view/overview`,
        'Exemption recorded. <b>You must remove this exemption when the reason no longer applies.</b>',
      )
      expect(res.redirect).not.toHaveBeenCalled()
    })
  })
})
