import { Request, Response } from 'express'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import ConfirmExemptionController from './confirmExemptionController'
import ConfirmExemptionView from './confirmExemptionView'

jest.mock('../pageFlowHistory', () => ({
  addCurrentPageToHistory: jest.fn(),
}))
describe('ConfirmExemptionController', () => {
  const controller = new ConfirmExemptionController()
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
      locals: { prisonerSummary },
    } as unknown as Response
    jest.clearAllMocks()
  })

  describe('getConfirmExemptionView', () => {
    it('should render the "Are you sure you want to put review on hold" page', async () => {
      // Given
      const reviewExemptionDto = {
        exemptionReason: 'EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY',
        exemptionReasonDetails: 'In treatment',
      }
      getPrisonerContext(req.session, prisonNumber).reviewExemptionDto = reviewExemptionDto

      const expectedViewData = new ConfirmExemptionView(prisonerSummary, reviewExemptionDto).renderArgs

      // When
      await controller.getConfirmExemptionView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/confirmExemption/index', expectedViewData)
    })
  })

  describe('submitConfirmException', () => {
    it(`should redirect to 'Exemption recorded' page given form submitted successfully`, async () => {
      // Given
      const reviewExemptionDto = {
        exemptionReason: 'EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY',
        exemptionReasonDetails: 'In treatment',
      }
      getPrisonerContext(req.session, prisonNumber).reviewExemptionDto = reviewExemptionDto

      // When
      await controller.submitConfirmExemption(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/review/exemption/recorded')
      expect(getPrisonerContext(req.session, prisonNumber).reviewExemptionDto).toEqual(reviewExemptionDto)
    })
  })
})
