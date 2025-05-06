import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { CreateGoalDto } from 'dto'
import type { CreateGoalsForm } from 'forms'
import CreateGoalsController from './createGoalsController'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import validateCreateGoalsForm from './createGoalsFormValidator'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import AuditService, { BaseAuditData } from '../../services/auditService'
import toCreateGoalDtos from '../../data/mappers/createGoalDtoMapper'
import GoalTargetCompletionDateOption from '../../enums/goalTargetCompletionDateOption'
import { aValidGoal } from '../../testsupport/actionPlanTestDataBuilder'

jest.mock('../../services/educationAndWorkPlanService')
jest.mock('../../services/auditService')
jest.mock('./createGoalsFormValidator')
jest.mock('../../data/mappers/createGoalDtoMapper')

/**
 * Unit tests for createGoalsController.
 */
describe('createGoalsController', () => {
  const mockedCreateGoalsFormValidator = validateCreateGoalsForm as jest.MockedFn<typeof validateCreateGoalsForm>
  const mockedCreateGoalDtosMapper = toCreateGoalDtos as jest.MockedFn<typeof toCreateGoalDtos>

  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new CreateGoalsController(educationAndWorkPlanService, auditService)

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const username = 'a-dps-user'
  const expectedPrisonId = 'MDI'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber, prisonId: expectedPrisonId })
  const requestId = 'deff305c-2460-4d07-853e-f8762a8a52c6'

  const req = {
    journeyData: {},
    body: {},
    user: { username },
    params: { prisonNumber, journeyId },
    query: {},
    id: requestId,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithSuccess: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  let errors: Array<Record<string, string>>

  beforeEach(() => {
    jest.resetAllMocks()
    res.locals = { prisonerSummary }
    req.journeyData = {}
    errors = []
  })

  describe('getCreateGoalsView', () => {
    it('should get create goals view with no form object in the journeyData', async () => {
      // Given
      req.journeyData.createGoalsForm = undefined

      const expectedView = {
        prisonerSummary,
        goalTargetCompletionDateOptions: GoalTargetCompletionDateOption,
      }

      // When
      await controller.getCreateGoalsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/createGoals/index', expectedView)
      expect(req.journeyData.createGoalsForm).toBeUndefined()
    })

    it('should get create goals view given form object is already in the journeyData', async () => {
      // Given
      const expectedCreateGoalsForm: CreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            manuallyEnteredTargetCompletionDate: '31/12/2024',
            steps: [{ title: 'Book Course' }, { title: 'Attend Course' }],
          },
        ],
      }
      req.journeyData.createGoalsForm = expectedCreateGoalsForm

      const expectedView = {
        prisonerSummary,
        form: expectedCreateGoalsForm,
        goalTargetCompletionDateOptions: GoalTargetCompletionDateOption,
      }

      // When
      await controller.getCreateGoalsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/createGoals/index', expectedView)
      expect(req.journeyData.createGoalsForm).toEqual(expectedCreateGoalsForm)
    })
  })

  describe('submitCreateGoalsForm', () => {
    it('should call API to create goals and redirect to overview given value CreateGoalsForm given prisoners Action Plan already exists', async () => {
      // Given
      res.locals.actionPlan = {
        prisonNumber,
        goals: [aValidGoal()],
        problemRetrievingData: false,
      }

      const submittedCreateGoalsForm: CreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDate: '2025-04-10',
            steps: [{ title: 'Find available courses' }],
          },
        ],
      }
      req.body = submittedCreateGoalsForm

      req.journeyData.createGoalsForm = undefined

      mockedCreateGoalsFormValidator.mockReturnValue(errors)

      const expectedCreateGoalDtos: Array<CreateGoalDto> = [
        {
          prisonNumber,
          prisonId: expectedPrisonId,
          title: 'Learn French',
          steps: [{ title: 'Book Course', sequenceNumber: 1 }],
          targetCompletionDate: new Date('2024-12-31T00:00:00.000Z'),
        },
        {
          prisonNumber,
          prisonId: expectedPrisonId,
          title: 'Learn Spanish',
          steps: [{ title: 'Find available courses', sequenceNumber: 1 }],
          targetCompletionDate: new Date('2025-04-10T00:00:00.000Z'),
        },
      ]
      mockedCreateGoalDtosMapper.mockReturnValue(expectedCreateGoalDtos)

      const expectedBaseAuditDataForFirstGoal: BaseAuditData = {
        correlationId: requestId,
        details: { goalNumber: 1, ofGoalsCreatedInThisRequest: 2 },
        subjectId: prisonNumber,
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }
      const expectedBaseAuditDataForSecondGoal: BaseAuditData = {
        correlationId: requestId,
        details: { goalNumber: 2, ofGoalsCreatedInThisRequest: 2 },
        subjectId: prisonNumber,
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }

      // When
      await controller.submitCreateGoalsForm(req, res, next)

      // Then
      expect(res.redirectWithSuccess).toHaveBeenCalledWith('/plan/A1234BC/view/overview', 'Goals added')
      expect(mockedCreateGoalsFormValidator).toHaveBeenCalledWith(submittedCreateGoalsForm)
      expect(mockedCreateGoalDtosMapper).toHaveBeenCalledWith(submittedCreateGoalsForm, expectedPrisonId)
      expect(educationAndWorkPlanService.createGoals).toHaveBeenCalledWith(
        prisonNumber,
        expectedCreateGoalDtos,
        username,
      )
      expect(req.journeyData.createGoalsForm).toBeUndefined()
      expect(auditService.logCreateGoal).toHaveBeenCalledTimes(2)
      expect(auditService.logCreateGoal).toHaveBeenCalledWith(expectedBaseAuditDataForFirstGoal)
      expect(auditService.logCreateGoal).toHaveBeenCalledWith(expectedBaseAuditDataForSecondGoal)
    })

    it('should call API to create action plan and redirect to overview given value CreateGoalsForm given prisoners Action Plan does not already exist', async () => {
      // Given
      res.locals.actionPlan = {
        prisonNumber,
        goals: [],
        problemRetrievingData: false,
      }

      const submittedCreateGoalsForm: CreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Book Course' }],
          },
        ],
      }
      req.body = submittedCreateGoalsForm

      req.journeyData.createGoalsForm = undefined

      mockedCreateGoalsFormValidator.mockReturnValue(errors)

      const expectedCreateGoalDtos: Array<CreateGoalDto> = [
        {
          prisonNumber,
          prisonId: expectedPrisonId,
          title: 'Learn French',
          steps: [{ title: 'Book Course', sequenceNumber: 1 }],
          targetCompletionDate: new Date('2024-12-31T00:00:00.000Z'),
        },
      ]
      mockedCreateGoalDtosMapper.mockReturnValue(expectedCreateGoalDtos)

      const expectedBaseAuditDataForFirstGoal: BaseAuditData = {
        correlationId: requestId,
        details: { goalNumber: 1, ofGoalsCreatedInThisRequest: 1 },
        subjectId: prisonNumber,
        subjectType: 'PRISONER_ID',
        who: 'a-dps-user',
      }

      // When
      await controller.submitCreateGoalsForm(req, res, next)

      // Then
      expect(res.redirectWithSuccess).toHaveBeenCalledWith('/plan/A1234BC/view/overview', 'Goals added')
      expect(mockedCreateGoalsFormValidator).toHaveBeenCalledWith(submittedCreateGoalsForm)
      expect(mockedCreateGoalDtosMapper).toHaveBeenCalledWith(submittedCreateGoalsForm, expectedPrisonId)
      expect(educationAndWorkPlanService.createActionPlan).toHaveBeenCalledWith(
        {
          prisonNumber,
          goals: expectedCreateGoalDtos,
        },
        'a-dps-user',
      )
      expect(req.journeyData.createGoalsForm).toBeUndefined()
      expect(auditService.logCreateGoal).toHaveBeenCalledTimes(1)
      expect(auditService.logCreateGoal).toHaveBeenCalledWith(expectedBaseAuditDataForFirstGoal)
    })

    it('should redirect to create goals form given form validation fails', async () => {
      // Given
      const expectedCreateGoalsForm: CreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: '',
            manuallyEnteredTargetCompletionDate: '31/12/2024',
            steps: [{ title: 'Book Course' }],
          },
        ],
      }
      req.body = expectedCreateGoalsForm
      req.journeyData.createGoalsForm = undefined

      errors = [{ href: '#goals[0].title', text: 'some-title-error' }]
      mockedCreateGoalsFormValidator.mockReturnValue(errors)

      // When
      await controller.submitCreateGoalsForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(`/plan/A1234BC/goals/${journeyId}/create`, errors)
      expect(req.journeyData.createGoalsForm).toEqual(expectedCreateGoalsForm)
      expect(mockedCreateGoalsFormValidator).toHaveBeenCalledWith(expectedCreateGoalsForm)
      expect(auditService.logCreateGoal).not.toHaveBeenCalled()
    })

    it('should add a step to a goal', async () => {
      // Given
      const submittedCreateGoalsForm: CreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDate: '2025-04-10',
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
        ],
      }
      req.body = submittedCreateGoalsForm
      req.params.action = 'ADD_STEP'
      req.query.goalNumber = '1'

      req.journeyData.createGoalsForm = undefined

      const expectedCreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDate: '2025-04-10',
            steps: [{ title: 'Find available courses' }, { title: '' }], // expect new step as the last step of this goal
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
        ],
      }

      // When
      await controller.submitAction(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/A1234BC/goals/${journeyId}/create#goals[1].steps[1].title`)
      expect(req.journeyData.createGoalsForm).toEqual(expectedCreateGoalsForm)
      expect(mockedCreateGoalsFormValidator).not.toHaveBeenCalled()
      expect(auditService.logCreateGoal).not.toHaveBeenCalled()
    })

    it.each([undefined, '-1', 'A', '2'])(`should not add a step to a goal given form action %s`, async goalNumber => {
      // Given
      const submittedCreateGoalsForm: CreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn Spanish',
            targetCompletionDate: '2025-04-10',
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
        ],
      }
      req.body = submittedCreateGoalsForm
      req.params.action = 'ADD_STEP'
      req.query = { goalNumber }

      req.journeyData.createGoalsForm = undefined

      // When
      await controller.submitAction(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/A1234BC/goals/${journeyId}/create`)
      expect(req.journeyData.createGoalsForm).toEqual(submittedCreateGoalsForm)
      expect(mockedCreateGoalsFormValidator).not.toHaveBeenCalled()
      expect(auditService.logCreateGoal).not.toHaveBeenCalled()
    })

    it('should remove a step from a goal', async () => {
      // Given
      const submittedCreateGoalsForm: CreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDate: '2025-04-10',
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
        ],
      }
      req.body = submittedCreateGoalsForm
      req.params.action = 'REMOVE_STEP'
      req.query = {
        goalNumber: '2',
        stepNumber: '1',
      }

      req.journeyData.createGoalsForm = undefined

      const expectedCreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDate: '2025-04-10',
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Apply to get on activity' }, { title: 'Pass exam' }], // expect "Attend activity" step to be removed
          },
        ],
      }

      // When
      await controller.submitAction(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/A1234BC/goals/${journeyId}/create#goals[2].steps[1].title`) // focus the Pass exam step of the bricklaying course as that is the last step in the goal
      expect(req.journeyData.createGoalsForm).toEqual(expectedCreateGoalsForm)
      expect(mockedCreateGoalsFormValidator).not.toHaveBeenCalled()
      expect(auditService.logCreateGoal).not.toHaveBeenCalled()
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
          prisonNumber,
          goals: [
            {
              title: 'Learn Spanish',
              targetCompletionDate: '2025-04-10',
              steps: [{ title: 'Find available courses' }],
            },
            {
              title: 'Attend bricklaying workshop',
              targetCompletionDate: '2024-12-31',
              steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
            },
          ],
        }
        req.body = submittedCreateGoalsForm
        req.query = {
          goalNumber,
          stepNumber,
        }

        req.journeyData.createGoalsForm = undefined

        // When
        await controller.submitAction(req, res, next)

        // Then
        expect(res.redirect).toHaveBeenCalledWith(`/plan/A1234BC/goals/${journeyId}/create`)
        expect(req.journeyData.createGoalsForm).toEqual(submittedCreateGoalsForm)
        expect(mockedCreateGoalsFormValidator).not.toHaveBeenCalled()
        expect(auditService.logCreateGoal).not.toHaveBeenCalled()
      },
    )

    it('should add another goal', async () => {
      // Given
      const submittedCreateGoalsForm: CreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDate: '2025-04-10',
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
        ],
      }
      req.body = submittedCreateGoalsForm
      req.params.action = 'ADD_GOAL'

      req.journeyData.createGoalsForm = undefined

      const expectedCreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDate: '2025-04-10',
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDate: '2024-12-31',
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
      expect(res.redirect).toHaveBeenCalledWith(`/plan/A1234BC/goals/${journeyId}/create#goals[3].title`)
      expect(req.journeyData.createGoalsForm).toEqual(expectedCreateGoalsForm)
      expect(mockedCreateGoalsFormValidator).not.toHaveBeenCalled()
      expect(auditService.logCreateGoal).not.toHaveBeenCalled()
    })

    it('should remove a goal', async () => {
      // Given
      req.params.action = 'REMOVE_GOAL'
      req.query.goalNumber = '1'

      const submittedCreateGoalsForm: CreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Book Course' }],
          },
          {
            title: 'Learn Spanish',
            targetCompletionDate: '2025-04-10',
            steps: [{ title: 'Find available courses' }],
          },
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
        ],
      }
      req.body = submittedCreateGoalsForm

      req.journeyData.createGoalsForm = undefined

      const expectedCreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Book Course' }],
          },
          // expect Learn Spanish goal to be removed
          {
            title: 'Attend bricklaying workshop',
            targetCompletionDate: '2024-12-31',
            steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
          },
        ],
      }

      // When
      await controller.submitAction(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/A1234BC/goals/${journeyId}/create#goals[1].steps[2].title`) // focus the Pass exam step of the bricklaying course as that is the last step in the goal
      expect(req.journeyData.createGoalsForm).toEqual(expectedCreateGoalsForm)
      expect(mockedCreateGoalsFormValidator).not.toHaveBeenCalled()
      expect(auditService.logCreateGoal).not.toHaveBeenCalled()
    })

    it.each([undefined, '-1', 'A', '2'])(
      `should not remove a goal given form give goal number, %s`,
      async goalNumber => {
        // Given
        req.params.action = 'REMOVE_GOAL'
        req.query = { goalNumber }

        const submittedCreateGoalsForm: CreateGoalsForm = {
          prisonNumber,
          goals: [
            {
              title: 'Learn Spanish',
              targetCompletionDate: '2025-04-10',
              steps: [{ title: 'Find available courses' }],
            },
            {
              title: 'Attend bricklaying workshop',
              targetCompletionDate: '2024-12-31',
              steps: [{ title: 'Apply to get on activity' }, { title: 'Attend activity' }, { title: 'Pass exam' }],
            },
          ],
        }
        req.body = submittedCreateGoalsForm
        req.journeyData.createGoalsForm = undefined

        // When
        await controller.submitAction(req, res, next)

        // Then
        expect(res.redirect).toHaveBeenCalledWith(`/plan/A1234BC/goals/${journeyId}/create`)
        expect(req.journeyData.createGoalsForm).toEqual(submittedCreateGoalsForm)
        expect(mockedCreateGoalsFormValidator).not.toHaveBeenCalled()
        expect(auditService.logCreateGoal).not.toHaveBeenCalled()
      },
    )
  })
})
