import { Request, Response, NextFunction } from 'express'
import { SessionData } from 'express-session'
import CreateGoalController from './createGoalController'
import { PrisonerSearchService } from '../../services'
import validateAddStepForm from './addStepFormValidator'
import validateCreateGoalForm from './createGoalFormValidator'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'

jest.mock('./addStepFormValidator')
jest.mock('./createGoalFormValidator')

describe('createGoalController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mockedValidateCreateGoalForm = validateCreateGoalForm as jest.MockedFunction<typeof validateCreateGoalForm>
  const mockedValidateAddStepForm = validateAddStepForm as jest.MockedFunction<typeof validateAddStepForm>

  const prisonerSearchService = {
    getPrisonerByPrisonNumber: jest.fn(),
  }

  const educationAndWorkPlanService = {
    createGoal: jest.fn(),
  }

  const controller = new CreateGoalController(
    prisonerSearchService as unknown as PrisonerSearchService,
    educationAndWorkPlanService as unknown as EducationAndWorkPlanService,
  )

  const req = {
    session: {} as SessionData,
    body: {},
    params: {} as Record<string, string>,
    flash: jest.fn(),
  }
  const res = {
    redirect: jest.fn(),
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.body = {}
    req.params = {} as Record<string, string>
  })

  describe('submitAddStepForm', () => {
    it('should redirect to add note form given action is submit-form and validation passes', async () => {
      // Given
      req.params.prisonNumber = 'A1234GC'
      req.body = {
        stepNumber: '1',
        title: 'Book French lessons',
        'targetDate-day': '31',
        'targetDate-month': '12',
        'targetDate-year': '2024',
        action: 'submit-form',
      }
      req.session.addStepForms = []

      mockedValidateAddStepForm.mockReturnValue([])

      // When
      await controller.submitAddStepForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234GC/goals/add-note')
      expect(req.flash).not.toHaveBeenCalled()
    })

    it('should redirect to add step form given action is add-another-step and validation passes', async () => {
      // Given
      req.params.prisonNumber = 'A1234GC'
      req.body = {
        stepNumber: '1',
        title: 'Book French lessons',
        'targetDate-day': '31',
        'targetDate-month': '12',
        'targetDate-year': '2024',
        action: 'add-another-step',
      }
      req.session.addStepForms = []

      mockedValidateAddStepForm.mockReturnValue([])

      // When
      await controller.submitAddStepForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234GC/goals/add-step')
      expect(req.flash).not.toHaveBeenCalled()
      expect(req.session.addStepForm).toEqual({ stepNumber: 2 })
    })

    it('should redirect to add step form given validation fails', async () => {
      // Given
      req.params.prisonNumber = 'A1234GC'
      req.body = {}
      req.session.addStepForms = []

      const errors = [
        { href: '#title', text: 'some-title-error' },
        { href: '#targetDate', text: 'a-target-date-error' },
      ]
      mockedValidateAddStepForm.mockReturnValue(errors)

      // When
      await controller.submitAddStepForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234GC/goals/add-step')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
    })
  })
})
