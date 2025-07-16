import { Request, Response } from 'express'
import { startOfDay } from 'date-fns'
import { v4 as uuidV4 } from 'uuid'
import type { ReviewPlanDto } from 'dto'
import type { ReviewNoteForm } from 'reviewPlanForms'
import ReviewNoteController from './reviewNoteController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import SessionCompletedByValue from '../../../enums/sessionCompletedByValue'

describe('reviewNoteController', () => {
  const controller = new ReviewNoteController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const req = {
    session: {},
    body: {},
    params: { prisonNumber, journeyId },
    journeyData: {},
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

  describe('getReviewNoteView', () => {
    it(`should get 'review note' view given form is not res.locals.invalidForm, but DTO is on the context`, async () => {
      // Given
      const reviewPlanDto: ReviewPlanDto = {
        prisonNumber,
        prisonId: 'BXI',
        completedBy: SessionCompletedByValue.MYSELF,
        reviewDate: startOfDay('2024-03-09'),
        notes: 'Chris has progressed well',
      }
      req.journeyData.reviewPlanDto = reviewPlanDto

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
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/review/reviewNote/index', expectedView)
    })

    it(`should get 'review note' view given form is already res.locals.invalidForm`, async () => {
      // Given
      const expectedForm: ReviewNoteForm = {
        notes: 'Chris has progressed well',
      }

      res.locals.invalidForm = expectedForm

      const expectedView = {
        prisonerSummary,
        form: expectedForm,
      }

      // When
      await controller.getReviewNoteView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/review/reviewNote/index', expectedView)
    })
  })

  describe('submitReviewNoteForm', () => {
    it('should redirect to check your answers page given form submitted successfully', async () => {
      // Given
      const reviewPlanDto: ReviewPlanDto = {
        prisonNumber,
        prisonId: 'BXI',
        completedBy: SessionCompletedByValue.MYSELF,
        reviewDate: startOfDay('2024-03-09'),
        notes: undefined,
      }
      req.journeyData.reviewPlanDto = reviewPlanDto

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
      expect(res.redirect).toHaveBeenCalledWith(`/plan/A1234BC/${journeyId}/review/check-your-answers`)
      expect(res.locals.invalidForm).toBeUndefined()
      expect(req.journeyData.reviewPlanDto).toEqual(expectedReviewPlanDto)
    })
  })
})
