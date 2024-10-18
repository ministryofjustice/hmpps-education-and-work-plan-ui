import { Request, Response, NextFunction } from 'express'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import CompleteOrArchiveGoalController from './completeOrArchiveGoalController'

jest.mock('../../services/educationAndWorkPlanService')

describe('CompleteOrArchiveGoalController - submitCompleteOrArchiveGoalForm', () => {
  let controller: CompleteOrArchiveGoalController
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction
  let mockService: jest.Mocked<EducationAndWorkPlanService>

  beforeEach(() => {
    mockService = new EducationAndWorkPlanService(null, null, null) as jest.Mocked<EducationAndWorkPlanService>
    controller = new CompleteOrArchiveGoalController(mockService)

    req = {
      params: {
        prisonNumber: 'A1234BC',
        goalReference: 'GOAL123',
      },
      body: {
        archiveOrComplete: '',
      },
    }

    res = {
      redirect: jest.fn(),
    }

    next = jest.fn()
  })

  it('should redirect to the complete goal page when form is submitted with "COMPLETE"', async () => {
    req.body.archiveOrComplete = 'COMPLETE'

    await controller.submitCompleteOrArchiveGoalForm(req as Request, res as Response, next)

    expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/GOAL123/complete')
    expect(next).not.toHaveBeenCalled()
  })

  it('should redirect to the archive goal page when form is submitted with "ARCHIVE"', async () => {
    req.body.archiveOrComplete = 'ARCHIVE'

    await controller.submitCompleteOrArchiveGoalForm(req as Request, res as Response, next)

    expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/GOAL123/archive')
    expect(next).not.toHaveBeenCalled()
  })

  it('should handle invalid form submission gracefully and redirect to the archive page as fallback', async () => {
    req.body.archiveOrComplete = 'INVALID_OPTION'

    await controller.submitCompleteOrArchiveGoalForm(req as Request, res as Response, next)

    expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/GOAL123/archive')
    expect(next).not.toHaveBeenCalled()
  })
})
