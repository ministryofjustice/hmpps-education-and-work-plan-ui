import { Request, Response } from 'express'
import type { CreateGoalDto } from 'dto'
import type { CreateGoalsForm } from 'forms'
import CreateGoalsController from './createGoalsController'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import validateCreateGoalsForm from './createGoalsFormValidator'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import AuditService, { BaseAuditData } from '../../services/auditService'
import toCreateGoalDtos from '../../data/mappers/createGoalDtoMapper'
import GoalTargetCompletionDateOption from '../../enums/goalTargetCompletionDateOption'

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

  const prisonNumber = 'A1234BC'
  const expectedPrisonId = 'MDI'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber, expectedPrisonId)
  const requestId = 'deff305c-2460-4d07-853e-f8762a8a52c6'

  const req = {
    session: { prisonerSummary },
    body: {},
    user: { username: 'a-dps-user' },
    params: { prisonNumber },
    query: {},
    id: requestId,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithSuccess: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  let errors: Array<Record<string, string>>

  beforeEach(() => {
    jest.resetAllMocks()
    errors = []
  })

  describe('getCreateGoalsView', () => {
    it('should get create goals view with no form object on the session', async () => {
      // Given
      req.session.createGoalsForm = undefined

      const expectedView = {
        prisonerSummary,
        goalTargetCompletionDateOptions: GoalTargetCompletionDateOption,
      }

      // When
      await controller.getCreateGoalsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/createGoals/index', expectedView)
      expect(req.session.createGoalsForm).toBeUndefined()
    })

    it('should get create goals view given form object is already on the session', async () => {
      // Given
      const expectedCreateGoalsForm: CreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: 'Learn French',
            'targetCompletionDate-day': '31',
            'targetCompletionDate-month': '12',
            'targetCompletionDate-year': '2024',
            steps: [{ title: 'Book Course' }, { title: 'Attend Course' }],
          },
        ],
      }
      req.session.createGoalsForm = expectedCreateGoalsForm

      const expectedView = {
        prisonerSummary,
        form: expectedCreateGoalsForm,
        goalTargetCompletionDateOptions: GoalTargetCompletionDateOption,
      }

      // When
      await controller.getCreateGoalsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/createGoals/index', expectedView)
      expect(req.session.createGoalsForm).toBeUndefined()
    })
  })

  describe('submitCreateGoalsForm', () => {
    it('should call API to create goals and redirect to overview given value CreateGoalsForm', async () => {
      // Given
      req.user.token = 'some-token'
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

      req.session.createGoalsForm = undefined

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
        'some-token',
      )
      expect(req.session.createGoalsForm).toBeUndefined()
      expect(auditService.logCreateGoal).toHaveBeenCalledTimes(2)
      expect(auditService.logCreateGoal).toHaveBeenCalledWith(expectedBaseAuditDataForFirstGoal)
      expect(auditService.logCreateGoal).toHaveBeenCalledWith(expectedBaseAuditDataForSecondGoal)
    })

    it('should redirect to create goals form given form validation fails', async () => {
      // Given
      const expectedCreateGoalsForm: CreateGoalsForm = {
        prisonNumber,
        goals: [
          {
            title: '',
            'targetCompletionDate-day': '31',
            'targetCompletionDate-month': '12',
            'targetCompletionDate-year': '2024',
            steps: [{ title: 'Book Course' }],
          },
        ],
      }
      req.body = expectedCreateGoalsForm
      req.session.createGoalsForm = undefined

      errors = [{ href: '#goals[0].title', text: 'some-title-error' }]
      mockedCreateGoalsFormValidator.mockReturnValue(errors)

      // When
      await controller.submitCreateGoalsForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/plan/A1234BC/goals/create', errors)
      expect(req.session.createGoalsForm).toEqual(expectedCreateGoalsForm)
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

      req.session.createGoalsForm = undefined

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
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create#goals[1].steps[1].title')
      expect(req.session.createGoalsForm).toEqual(expectedCreateGoalsForm)
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

      req.session.createGoalsForm = undefined

      // When
      await controller.submitAction(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create')
      expect(req.session.createGoalsForm).toEqual(submittedCreateGoalsForm)
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

      req.session.createGoalsForm = undefined

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
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create#goals[2].steps[1].title') // focus the Pass exam step of the bricklaying course as that is the last step in the goal
      expect(req.session.createGoalsForm).toEqual(expectedCreateGoalsForm)
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

        req.session.createGoalsForm = undefined

        // When
        await controller.submitAction(req, res, next)

        // Then
        expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create')
        expect(req.session.createGoalsForm).toEqual(submittedCreateGoalsForm)
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

      req.session.createGoalsForm = undefined

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
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create#goals[3].title')
      expect(req.session.createGoalsForm).toEqual(expectedCreateGoalsForm)
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

      req.session.createGoalsForm = undefined

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
      expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create#goals[1].steps[2].title') // focus the Pass exam step of the bricklaying course as that is the last step in the goal
      expect(req.session.createGoalsForm).toEqual(expectedCreateGoalsForm)
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
        req.session.createGoalsForm = undefined

        // When
        await controller.submitAction(req, res, next)

        // Then
        expect(res.redirect).toHaveBeenCalledWith('/plan/A1234BC/goals/create')
        expect(req.session.createGoalsForm).toEqual(submittedCreateGoalsForm)
        expect(mockedCreateGoalsFormValidator).not.toHaveBeenCalled()
        expect(auditService.logCreateGoal).not.toHaveBeenCalled()
      },
    )
  })
})
