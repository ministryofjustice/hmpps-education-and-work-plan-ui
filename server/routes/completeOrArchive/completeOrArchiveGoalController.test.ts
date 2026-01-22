import { Request, Response } from 'express'
import CompleteOrArchiveGoalController from './completeOrArchiveGoalController'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../utils/result/result'
import { aValidGoal } from '../../testsupport/actionPlanTestDataBuilder'

describe('CompleteOrArchiveGoalController - submitCompleteOrArchiveGoalForm', () => {
  const controller = new CompleteOrArchiveGoalController()

  const prisonNumber = 'A1234GC'
  const prisonId = 'BXI'
  const username = 'a-dps-user'
  const goalReference = '1a2eae63-8102-4155-97cb-43d8fb739caf'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber, prisonId })
  const goal = Result.fulfilled(aValidGoal({ goalReference }))

  const req = {
    session: {},
    user: { username },
    params: { prisonNumber, goalReference },
  } as unknown as Request

  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary, goal },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
  })

  describe('get complete or archive goal view', () => {
    it('should get the complete or archive goal view', async () => {
      // Given

      // When
      await controller.getCompleteOrArchiveGoalView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/goal/completeorarchive/index', {
        prisonerSummary,
        goal,
        form: { archiveOrComplete: '' },
      })
    })
  })

  describe('submit complete or archive goal form', () => {
    it('should redirect to the complete goal page when form is submitted with "COMPLETE"', async () => {
      req.body.archiveOrComplete = 'COMPLETE'

      await controller.submitCompleteOrArchiveGoalForm(req as Request, res as Response, next)

      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/${goalReference}/complete`)
    })

    it('should redirect to the archive goal page when form is submitted with "ARCHIVE"', async () => {
      req.body.archiveOrComplete = 'ARCHIVE'

      await controller.submitCompleteOrArchiveGoalForm(req as Request, res as Response, next)

      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/${goalReference}/archive`)
    })

    it('should handle invalid form submission gracefully and redirect to the archive page as fallback', async () => {
      req.body.archiveOrComplete = 'INVALID_OPTION'

      await controller.submitCompleteOrArchiveGoalForm(req as Request, res as Response, next)

      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/${goalReference}/archive`)
    })
  })
})
