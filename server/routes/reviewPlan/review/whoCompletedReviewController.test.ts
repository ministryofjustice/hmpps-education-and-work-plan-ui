import { Request, Response } from 'express'
import { startOfDay } from 'date-fns'
import { v4 as uuidV4 } from 'uuid'
import type { WhoCompletedReviewForm } from 'reviewPlanForms'
import type { ReviewPlanDto } from 'dto'
import WhoCompletedReviewController from './whoCompletedReviewController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
import SessionCompletedByValue from '../../../enums/sessionCompletedByValue'

describe('whoCompletedReviewController', () => {
  const controller = new WhoCompletedReviewController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

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
    getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm = undefined
  })

  describe('getWhoCompletedReviewView', () => {
    it(`should get 'who completed review' view given form is not on the prisoner context, but DTO is on the context`, async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm = undefined

      const reviewPlanDto: ReviewPlanDto = {
        prisonNumber,
        prisonId: 'BXI',
        completedBy: SessionCompletedByValue.MYSELF,
        reviewDate: startOfDay('2024-03-09'),
      }
      req.journeyData.reviewPlanDto = reviewPlanDto

      const expectedForm: WhoCompletedReviewForm = {
        completedBy: SessionCompletedByValue.MYSELF,
        completedByOtherFullName: undefined,
        completedByOtherJobRole: undefined,
        reviewDate: '9/3/2024',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedForm,
      }

      // When
      await controller.getWhoCompletedReviewView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/review/whoCompletedReview/index', expectedView)
    })

    it(`should get 'who completed review' view given form is already on the prisoner context`, async () => {
      // Given
      const expectedForm: WhoCompletedReviewForm = {
        completedBy: SessionCompletedByValue.MYSELF,
        reviewDate: '20/3/2024',
      }

      getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm = expectedForm

      const expectedView = {
        prisonerSummary,
        form: expectedForm,
      }

      // When
      await controller.getWhoCompletedReviewView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/review/whoCompletedReview/index', expectedView)
    })
  })

  describe('submitWhoCompletedReviewForm', () => {
    it('should redisplay page given form submitted with validation errors', async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm = undefined

      const invalidForm: WhoCompletedReviewForm = {
        completedBy: SessionCompletedByValue.SOMEBODY_ELSE,
        reviewDate: '20/3/2024',
      }
      req.body = invalidForm

      const expectedErrors = [
        { href: '#completedByOtherFullName', text: 'Enter the full name of the person who completed the review' },
        { href: '#completedByOtherJobRole', text: 'Enter the job title of the person who completed the review' },
      ]

      // When
      await controller.submitWhoCompletedReviewForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(`/plan/A1234BC/${journeyId}/review`, expectedErrors)
      expect(getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm).toEqual(invalidForm)
    })

    it('should redirect to review notes page given form submitted successfully and previous page was not check-your-answers', async () => {
      // Given
      req.session.pageFlowHistory = undefined
      getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm = undefined

      const validForm: WhoCompletedReviewForm = {
        completedBy: SessionCompletedByValue.MYSELF,
        reviewDate: '9/3/2024',
      }
      req.body = validForm

      const reviewPlanDto: ReviewPlanDto = {
        prisonNumber,
        prisonId: 'BXI',
        completedBy: SessionCompletedByValue.MYSELF,
        reviewDate: startOfDay('2024-03-09'),
      }

      // When
      await controller.submitWhoCompletedReviewForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/A1234BC/${journeyId}/review/notes`)
      expect(getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm).toBeUndefined()
      expect(req.journeyData.reviewPlanDto).toEqual(reviewPlanDto)
    })

    it('should redirect to review check-your-answers page given form submitted successfully and previous page was check-your-answers', async () => {
      // Given
      req.session.pageFlowHistory = {
        currentPageIndex: 0,
        pageUrls: [`/plan/${prisonNumber}/review/check-your-answers`],
      }
      getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm = undefined

      const validForm: WhoCompletedReviewForm = {
        completedBy: SessionCompletedByValue.MYSELF,
        reviewDate: '9/3/2024',
      }
      req.body = validForm

      const reviewPlanDto: ReviewPlanDto = {
        prisonNumber,
        prisonId: 'BXI',
        completedBy: SessionCompletedByValue.MYSELF,
        reviewDate: startOfDay('2024-03-09'),
      }

      // When
      await controller.submitWhoCompletedReviewForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/A1234BC/${journeyId}/review/check-your-answers`)
      expect(getPrisonerContext(req.session, prisonNumber).whoCompletedReviewForm).toBeUndefined()
      expect(req.journeyData.reviewPlanDto).toEqual(reviewPlanDto)
    })
  })
})
