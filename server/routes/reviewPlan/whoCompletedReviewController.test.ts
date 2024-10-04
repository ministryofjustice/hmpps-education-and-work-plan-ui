import { Request, Response } from 'express'
import type { WhoCompletedReviewForm } from 'reviewPlanForms'
import WhoCompletedReviewController from './whoCompletedReviewController'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import getPrisonerContext from '../../data/session/prisonerContexts'
import ReviewPlanCompletedByValue from '../../enums/reviewPlanCompletedByValue'

describe('whoCompletedReviewController', () => {
  const controller = new WhoCompletedReviewController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

  const req = {
    session: { prisonerSummary },
    body: {},
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm = undefined
  })

  describe('getWhoCompletedReviewView', () => {
    it(`should get 'who completed review' view given form is not on the prisoner context`, async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm = undefined

      const expectedForm = {} as WhoCompletedReviewForm
      const expectedView = {
        prisonerSummary,
        form: expectedForm,
      }

      // When
      await controller.getWhoCompletedReviewView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/whoCompletedReview/index', expectedView)
    })

    it(`should get 'who completed review' view given form is already on the prisoner context`, async () => {
      // Given
      const expectedForm: WhoCompletedReviewForm = {
        completedBy: ReviewPlanCompletedByValue.MYSELF,
        'reviewDate-day': '20',
        'reviewDate-month': '3',
        'reviewDate-year': '2024',
      }

      getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm = expectedForm

      const expectedView = {
        prisonerSummary,
        form: expectedForm,
      }

      // When
      await controller.getWhoCompletedReviewView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/whoCompletedReview/index', expectedView)
    })
  })

  describe('submitWhoCompletedReviewForm', () => {
    it('should redisplay page given form submitted with validation errors', async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm = undefined

      const invalidForm: WhoCompletedReviewForm = {
        completedBy: ReviewPlanCompletedByValue.SOMEBODY_ELSE,
        'reviewDate-day': '20',
        'reviewDate-month': '3',
        'reviewDate-year': '2024',
      }
      req.body = invalidForm

      const exoectedErrors = [
        { href: '#completedByOther', text: 'Enter the name of the person who completed the review' },
      ]

      // When
      await controller.submitWhoCompletedReviewForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/plan/A1234BC/review', exoectedErrors)
      expect(getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm).toEqual(invalidForm)
    })

    it('should redirect to review notes page given form submitted successfully', async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm = undefined

      const validForm: WhoCompletedReviewForm = {
        completedBy: ReviewPlanCompletedByValue.MYSELF,
        'reviewDate-day': '20',
        'reviewDate-month': '3',
        'reviewDate-year': '2024',
      }
      req.body = validForm

      // When
      await controller.submitWhoCompletedReviewForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/review/notes')
      expect(getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm).toEqual(validForm)
    })
  })
})
