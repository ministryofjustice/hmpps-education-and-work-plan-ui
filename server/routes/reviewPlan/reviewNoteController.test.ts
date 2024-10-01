import { Request, Response } from 'express'
import type { ReviewPlanDto } from 'dto'
import type { ReviewNoteForm } from 'reviewPlanForms'
import ReviewNoteController from './reviewNoteController'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import ReviewPlanCompletedByValue from '../../enums/reviewPlanCompletedByValue'

describe('reviewNoteController', () => {
  const controller = new ReviewNoteController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

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
    getPrisonerContext(req.session, prisonNumber).reviewPlanDto = undefined
    getPrisonerContext(req.session, prisonNumber).reviewNoteForm = undefined
  })

  describe('getReviewNoteView', () => {
    it(`should get 'review note' view given form is not on the prisoner context, but DTO is on the context`, async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).reviewNoteForm = undefined

      const reviewPlanDto: ReviewPlanDto = {
        completedBy: ReviewPlanCompletedByValue.MYSELF,
        reviewDate: '2024-03-09',
        notes: 'Chris has progressed well',
      }
      getPrisonerContext(req.session, prisonNumber).reviewPlanDto = reviewPlanDto

      const expectedForm: ReviewNoteForm = {
        notes: 'Chris has progressed well',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedForm,
      }

      // When
      await controller.getReviewNoteView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/reviewNote/index', expectedView)
    })

    it(`should get 'review note' view given form is already on the prisoner context`, async () => {
      // Given
      const expectedForm: ReviewNoteForm = {
        notes: 'Chris has progressed well',
      }

      getPrisonerContext(req.session, prisonNumber).reviewNoteForm = expectedForm

      const expectedView = {
        prisonerSummary,
        form: expectedForm,
      }

      // When
      await controller.getReviewNoteView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/reviewNote/index', expectedView)
    })
  })

  describe('submitReviewNoteForm', () => {
    it('should redirect to check your answers page given form submitted successfully', async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).reviewNoteForm = undefined

      const reviewPlanDto: ReviewPlanDto = {
        completedBy: ReviewPlanCompletedByValue.MYSELF,
        reviewDate: '2024-03-09',
        notes: undefined,
      }
      getPrisonerContext(req.session, prisonNumber).reviewPlanDto = reviewPlanDto

      const validForm: ReviewNoteForm = {
        notes: 'Chris has progressed well',
      }
      req.body = validForm

      const expectedReviewPlanDto: ReviewPlanDto = {
        ...reviewPlanDto,
        notes: 'Chris has progressed well',
      }

      // When
      await controller.submitReviewNoteForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/review/check-your-answers')
      expect(getPrisonerContext(req.session, prisonNumber).reviewNoteForm).toBeUndefined()
      expect(getPrisonerContext(req.session, prisonNumber).reviewPlanDto).toEqual(expectedReviewPlanDto)
    })
  })
})
