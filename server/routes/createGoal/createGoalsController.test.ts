import { Request, Response } from 'express'
import { addMonths, startOfToday } from 'date-fns'
import type { CreateGoalDto } from 'dto'
import CreateGoalsController from './createGoalsController'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import { CreateGoalFormAction, CreateGoalsForm, GoalCompleteDateOptions } from './validators/GoalForm'

jest.mock('../../services/educationAndWorkPlanService')

/**
 * Unit tests for createGoalsController.
 */
describe('createGoalsController', () => {
  const educationAndWorkPlanService = new EducationAndWorkPlanService(null) as jest.Mocked<EducationAndWorkPlanService>
  const controller = new CreateGoalsController(educationAndWorkPlanService)

  let req: Request
  const res = {
    redirect: jest.fn(),
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  const prisonNumber = 'A1234BC'
  const expectedPrisonId = 'MDI'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber, expectedPrisonId)

  beforeEach(() => {
    jest.resetAllMocks()

    req = {
      session: { prisonerSummary },
      body: {},
      user: {},
      params: { prisonNumber },
      query: {},
      flash: jest.fn(),
    } as unknown as Request
  })

  describe('getCreateGoalsView', () => {
    it('should get create goals view', async () => {
      const expectedView = {
        prisonerSummary,
        goalCompleteDateOptions: GoalCompleteDateOptions,
      }

      // When
      await controller.getCreateGoalsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/createGoals/index', expectedView)
    })
  })

  describe('submitCreateGoalsForm', () => {
    it('should call API to create goals and redirect to overview given value CreateGoalsForm', async () => {
      // Given
      req.user.token = 'some-token'
      const submittedCreateGoalsForm: CreateGoalsForm = {
        goals: [
          {
            title: 'Learn French',
            targetCompletionDateOption: GoalCompleteDateOptions.THREE_MONTHS,
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDateOption: GoalCompleteDateOptions.SIX_MONTHS,
            steps: [{ title: 'Find available courses' }],
          },
        ],
      }
      req.body = submittedCreateGoalsForm

      const expectedCreateGoalDtos: Array<CreateGoalDto> = [
        {
          prisonNumber,
          prisonId: expectedPrisonId,
          title: 'Learn French',
          steps: [{ title: 'Book Course', sequenceNumber: 1 }],
          targetCompletionDate: addMonths(startOfToday(), 3),
        },
        {
          prisonNumber,
          prisonId: expectedPrisonId,
          title: 'Learn Spanish',
          steps: [{ title: 'Find available courses', sequenceNumber: 1 }],
          targetCompletionDate: addMonths(startOfToday(), 6),
        },
      ]

      // When
      await controller.submitCreateGoalsForm(req, res, next)

      // Then
      expect(res.redirectWithSuccess).toHaveBeenCalledWith('/plan/A1234BC/view/overview', 'Goals added')
      expect(educationAndWorkPlanService.createGoals).toHaveBeenCalledWith(expectedCreateGoalDtos, 'some-token')
    })
  })

  describe('submitAction', () => {
    it('should add a step to a goal', async () => {
      // Given
      req.params.action = CreateGoalFormAction.ADD_STEP
      req.query = {
        goalNumber: '1',
      }
      const submittedCreateGoalsForm: CreateGoalsForm = {
        goals: [
          {
            title: 'Learn French',
            targetCompletionDateOption: GoalCompleteDateOptions.THREE_MONTHS,
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDateOption: GoalCompleteDateOptions.SIX_MONTHS,
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDateOption: GoalCompleteDateOptions.TWELVE_MONTHS,
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
        ],
      }
      req.body = submittedCreateGoalsForm

      const expectedCreateGoalsForm = {
        goals: [
          {
            title: 'Learn French',
            targetCompletionDateOption: GoalCompleteDateOptions.THREE_MONTHS,
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDateOption: GoalCompleteDateOptions.SIX_MONTHS,
            steps: [{ title: 'Find available courses' }, { title: '' }], // expect new step as the last step of this goal
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDateOption: GoalCompleteDateOptions.TWELVE_MONTHS,
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
        ],
      }

      // When
      await controller.submitAction(req, res, next)

      // Then
      expect(req.flash).toHaveBeenCalledWith('formValues', JSON.stringify(expectedCreateGoalsForm))
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create#goals-1-steps-1-title')
    })

    it.each([undefined, '-1', 'A', '2'])(`should not add a step to a goal given form action %s`, async stepNumber => {
      // Given
      const submittedCreateGoalsForm: CreateGoalsForm = {
        goals: [
          {
            title: 'Learn Spanish',
            targetCompletionDateOption: GoalCompleteDateOptions.THREE_MONTHS,
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDateOption: GoalCompleteDateOptions.SIX_MONTHS,
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
        ],
      }
      req.body = submittedCreateGoalsForm
      req.params.action = CreateGoalFormAction.ADD_STEP
      req.query = { stepNumber }

      const expectedCreateGoalsForm = {
        goals: [
          {
            title: 'Learn Spanish',
            targetCompletionDateOption: GoalCompleteDateOptions.THREE_MONTHS,
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDateOption: GoalCompleteDateOptions.SIX_MONTHS,
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
        ],
      }

      // When
      await controller.submitAction(req, res, next)

      // Then
      expect(req.flash).toHaveBeenCalledWith('formValues', JSON.stringify(expectedCreateGoalsForm))
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create')
    })

    it('should remove a step from a goal', async () => {
      // Given
      const submittedCreateGoalsForm: CreateGoalsForm = {
        goals: [
          {
            title: 'Learn French',
            targetCompletionDateOption: GoalCompleteDateOptions.THREE_MONTHS,
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDateOption: GoalCompleteDateOptions.SIX_MONTHS,
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDateOption: GoalCompleteDateOptions.TWELVE_MONTHS,
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
        ],
      }
      req.body = submittedCreateGoalsForm
      req.params.action = CreateGoalFormAction.REMOVE_STEP
      // remove from goal 3 step 2 (zero indexed array elements)
      req.query = {
        goalNumber: '2',
        stepNumber: '1',
      }

      const expectedCreateGoalsForm = {
        goals: [
          {
            title: 'Learn French',
            targetCompletionDateOption: GoalCompleteDateOptions.THREE_MONTHS,
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDateOption: GoalCompleteDateOptions.SIX_MONTHS,
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDateOption: GoalCompleteDateOptions.TWELVE_MONTHS,
            steps: [{ title: 'Apply to get on activity' }, { title: 'Pass exam' }], // expect "Attend activity" step to be removed
          },
        ],
      }

      // When
      await controller.submitAction(req, res, next)

      // Then
      expect(req.flash).toHaveBeenCalledWith('formValues', JSON.stringify(expectedCreateGoalsForm))
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create#goals-2-steps-1-title') // focus the Pass exam step of the bricklaying course as that is the last step in the goal
    })

    it.each([
      [undefined, undefined],
      ['-1', '-1'],
      ['1', '-1'],
      ['-1', '1'],
      ['A', '1'],
      ['1', 'A'],
      ['2', '0'],
      ['1', '3'],
    ])(
      `should not remove a step from a goal given goal number, %s and step number, %s`,
      async (goalNumber, stepNumber) => {
        // Given
        const submittedCreateGoalsForm: CreateGoalsForm = {
          goals: [
            {
              title: 'Learn Spanish',
              targetCompletionDateOption: GoalCompleteDateOptions.THREE_MONTHS,
              steps: [{ title: 'Find available courses' }],
            },
            {
              title: 'Attend bricklaying workshop',
              targetCompletionDateOption: GoalCompleteDateOptions.SIX_MONTHS,
              steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
            },
          ],
        }
        req.body = submittedCreateGoalsForm
        req.params.action = CreateGoalFormAction.REMOVE_STEP
        req.query = {
          goalNumber,
          stepNumber,
        }

        const expectedCreateGoalsForm: CreateGoalsForm = {
          goals: [
            {
              title: 'Learn Spanish',
              targetCompletionDateOption: GoalCompleteDateOptions.THREE_MONTHS,
              steps: [{ title: 'Find available courses' }],
            },
            {
              title: 'Attend bricklaying workshop',
              targetCompletionDateOption: GoalCompleteDateOptions.SIX_MONTHS,
              steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
            },
          ],
        }

        // When
        await controller.submitAction(req, res, next)

        // Then
        expect(req.flash).toHaveBeenCalledWith('formValues', JSON.stringify(expectedCreateGoalsForm))
        expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create')
      },
    )

    it('should add another goal', async () => {
      // Given
      const submittedCreateGoalsForm: CreateGoalsForm = {
        goals: [
          {
            title: 'Learn French',
            targetCompletionDateOption: GoalCompleteDateOptions.THREE_MONTHS,
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDateOption: GoalCompleteDateOptions.SIX_MONTHS,
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDateOption: GoalCompleteDateOptions.TWELVE_MONTHS,
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
        ],
      }
      req.body = submittedCreateGoalsForm
      req.params.action = CreateGoalFormAction.ADD_GOAL

      const expectedCreateGoalsForm = {
        goals: [
          {
            title: 'Learn French',
            targetCompletionDateOption: GoalCompleteDateOptions.THREE_MONTHS,
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDateOption: GoalCompleteDateOptions.SIX_MONTHS,
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDateOption: GoalCompleteDateOptions.TWELVE_MONTHS,
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
          {
            title: '',
            steps: [{ title: '' }],
          },
        ],
      }

      // When
      await controller.submitAction(req, res, next)

      // Then
      expect(req.flash).toHaveBeenCalledWith('formValues', JSON.stringify(expectedCreateGoalsForm))
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create#goals-3-title')
    })

    it('should remove a goal', async () => {
      // Given
      const submittedCreateGoalsForm: CreateGoalsForm = {
        goals: [
          {
            title: 'Learn French',
            targetCompletionDateOption: GoalCompleteDateOptions.THREE_MONTHS,
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDateOption: GoalCompleteDateOptions.SIX_MONTHS,
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDateOption: GoalCompleteDateOptions.TWELVE_MONTHS,
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
        ],
      }
      req.body = submittedCreateGoalsForm
      req.params.action = CreateGoalFormAction.REMOVE_GOAL
      req.query = {
        goalNumber: '1',
      }

      const expectedCreateGoalsForm = {
        goals: [
          {
            title: 'Learn French',
            targetCompletionDateOption: GoalCompleteDateOptions.THREE_MONTHS,
            steps: [{ title: 'Book Course' }],
          },
          // expect Learn Spanish goal to be removed
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDateOption: GoalCompleteDateOptions.TWELVE_MONTHS,
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
        ],
      }

      // When
      await controller.submitAction(req, res, next)

      // Then
      expect(req.flash).toHaveBeenCalledWith('formValues', JSON.stringify(expectedCreateGoalsForm))
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create#goals-1-title') // focus the Pass exam step of the bricklaying course as that is the last step in the goal
    })

    it.each([undefined, '-1', 'A', '2'])(
      `should not remove a goal given form give goal number, %s`,
      async goalNumber => {
        // Given
        req.params.action = CreateGoalFormAction.REMOVE_GOAL
        req.query = { goalNumber }
        req.body = {
          goals: [
            {
              title: 'Learn Spanish',
              targetCompletionDateOption: GoalCompleteDateOptions.THREE_MONTHS,
              steps: [{ title: 'Find available courses' }],
            },
            {
              title: 'Attend bricklaying workshop',
              targetCompletionDateOption: GoalCompleteDateOptions.THREE_MONTHS,
              steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
            },
          ],
        }

        const expectedCreateGoalsForm = {
          goals: [
            {
              title: 'Learn Spanish',
              targetCompletionDateOption: GoalCompleteDateOptions.THREE_MONTHS,
              steps: [{ title: 'Find available courses' }],
            },
            {
              title: 'Attend bricklaying workshop',
              targetCompletionDateOption: GoalCompleteDateOptions.THREE_MONTHS,
              steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
            },
          ],
        }

        // When
        await controller.submitAction(req, res, next)

        // Then
        expect(req.flash).toHaveBeenCalledWith('formValues', JSON.stringify(expectedCreateGoalsForm))
        expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create')
      },
    )
  })
})
