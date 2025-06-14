import { Request, Response } from 'express'
import { startOfDay } from 'date-fns'
import { v4 as uuidV4 } from 'uuid'
import type { ReviewPlanDto } from 'dto'
import type { ReviewNoteForm } from 'reviewPlanForms'
import ReviewNoteController from './reviewNoteController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { getPrisonerContext } from '../../../data/session/prisonerContexts'
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
    getPrisonerContext(req.session, prisonNumber).reviewNoteForm = undefined
  })

  describe('getReviewNoteView', () => {
    it(`should get 'review note' view given form is not on the prisoner context, but DTO is on the context`, async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).reviewNoteForm = undefined

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
      expect(res.render).toHaveBeenCalledWith('pages/reviewPlan/review/reviewNote/index', expectedView)
    })
  })

  describe('submitReviewNoteForm', () => {
    it('should redirect to check your answers page given form submitted successfully', async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).reviewNoteForm = undefined

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
      expect(getPrisonerContext(req.session, prisonNumber).reviewNoteForm).toBeUndefined()
      expect(req.journeyData.reviewPlanDto).toEqual(expectedReviewPlanDto)
    })
  })

  it('should redisplay page given form submitted without a note', async () => {
    // Given
    getPrisonerContext(req.session, prisonNumber).reviewNoteForm = undefined

    const invalidForm: ReviewNoteForm = {
      notes: undefined,
    }
    req.body = invalidForm

    const expectedErrors = [{ href: '#notes', text: 'You must add a note to this review' }]

    // When
    await controller.submitReviewNoteForm(req, res, next)

    // Then
    expect(res.redirectWithErrors).toHaveBeenCalledWith(`/plan/A1234BC/${journeyId}/review/notes`, expectedErrors)
    expect(getPrisonerContext(req.session, prisonNumber).reviewNoteForm).toEqual(invalidForm.notes)
  })

  it('should redisplay page given form submitted with a note that exceeds maximum length', async () => {
    // Given
    const invalidForm: ReviewNoteForm = {
      notes: 'a'.repeat(513),
    }
    getPrisonerContext(req.session, prisonNumber).reviewNoteForm = invalidForm

    req.body = invalidForm

    const expectedErrors = [{ href: '#notes', text: 'Review note must be 512 characters or less' }]

    // When
    await controller.submitReviewNoteForm(req, res, next)

    // Then
    expect(res.redirectWithErrors).toHaveBeenCalledWith(`/plan/A1234BC/${journeyId}/review/notes`, expectedErrors)
    expect(getPrisonerContext(req.session, prisonNumber).reviewNoteForm).toEqual(invalidForm)
  })
})
