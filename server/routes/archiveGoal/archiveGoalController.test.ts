import { Request, Response } from 'express'
import type { ArchiveGoalForm } from 'forms'
import createError from 'http-errors'
import type { ArchiveGoalDto } from 'dto'
import EducationAndWorkPlanService from '../../services/educationAndWorkPlanService'
import AuditService, { BaseAuditData } from '../../services/auditService'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import ArchiveGoalController from './archiveGoalController'
import { aValidGoal } from '../../testsupport/actionPlanTestDataBuilder'
import validateArchiveGoalForm from './archiveGoalFormValidator'
import aValidArchiveGoalForm from '../../testsupport/archiveGoalFormTestDataBuilder'
import ReasonToArchiveGoalValue from '../../enums/ReasonToArchiveGoalValue'
import toArchiveGoalDto from './mappers/archiveGoalFormToDtoMapper'
import { getPrisonerContext } from '../../data/session/prisonerContexts'
import { Result } from '../../utils/result/result'

jest.mock('../../services/educationAndWorkPlanService')
jest.mock('../../services/auditService')
jest.mock('./archiveGoalFormValidator')
jest.mock('./mappers/archiveGoalFormToDtoMapper')

describe('archiveGoalController', () => {
  const mockedValidateArchiveGoalForm = validateArchiveGoalForm as jest.MockedFunction<typeof validateArchiveGoalForm>
  const mockedArchiveGoalFormToArchiveGoalDtoMapper = toArchiveGoalDto as jest.MockedFunction<typeof toArchiveGoalDto>

  const educationAndWorkPlanService = new EducationAndWorkPlanService(
    null,
    null,
  ) as jest.Mocked<EducationAndWorkPlanService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new ArchiveGoalController(educationAndWorkPlanService, auditService)

  const prisonNumber = 'A1234GC'
  const prisonId = 'BXI'
  const username = 'a-dps-user'
  const goalReference = '1a2eae63-8102-4155-97cb-43d8fb739caf'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber, prisonId })
  const requestId = 'deff305c-2460-4d07-853e-f8762a8a52c6'
  const goal = Result.fulfilled(aValidGoal({ goalReference }))

  const flash = jest.fn()
  const req = {
    session: {},
    body: {},
    user: { username },
    params: { prisonNumber, goalReference },
    id: requestId,
    flash,
  } as unknown as Request

  const res = {
    redirect: jest.fn(),
    redirectWithSuccess: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary, goal },
  } as unknown as Response
  const next = jest.fn()

  let errors: Array<Record<string, string>>

  beforeEach(() => {
    jest.resetAllMocks()
    getPrisonerContext(req.session, prisonNumber).archiveGoalForm = undefined
    req.params.prisonNumber = prisonNumber
    req.params.goalReference = goalReference

    errors = []
  })

  describe('getArchiveGoalView', () => {
    it('should get archive goal view given there is no form on the prisoner context', async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).archiveGoalForm = undefined
      const expectedForm = {}

      // When
      await controller.getArchiveGoalView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/goal/archive/reason', {
        prisonerSummary,
        goal,
        archiveGoalForm: expectedForm,
      })
      expect(getPrisonerContext(req.session, prisonNumber).archiveGoalForm).toBeUndefined()
    })

    it('should get archive goal view given there is already a form on the prisoner context', async () => {
      // Given
      const expectedForm = aValidArchiveGoalForm(goalReference)
      getPrisonerContext(req.session, prisonNumber).archiveGoalForm = expectedForm

      // When
      await controller.getArchiveGoalView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/goal/archive/reason', {
        prisonerSummary,
        goal,
        archiveGoalForm: expectedForm,
      })
      expect(getPrisonerContext(req.session, prisonNumber).archiveGoalForm).toBeUndefined()
    })
  })

  describe('submitArchiveGoalForm', () => {
    it('should redirect to review archive goal page given action is submit-form and validation passes', async () => {
      // Given
      req.params.prisonNumber = 'A1234GC'

      const archiveGoalForm = aValidArchiveGoalForm(goalReference)
      req.body = { ...archiveGoalForm }

      mockedValidateArchiveGoalForm.mockReturnValue([])

      // When
      await controller.submitArchiveGoalForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/${goalReference}/archive/review`)
      expect(mockedValidateArchiveGoalForm).toHaveBeenCalledWith(archiveGoalForm)
      expect(getPrisonerContext(req.session, prisonNumber).archiveGoalForm).toStrictEqual(archiveGoalForm)
      expect(educationAndWorkPlanService.archiveGoal).not.toHaveBeenCalled()
    })

    it('should redirect to archive goal form given validation fails', async () => {
      // Given
      req.params.prisonNumber = 'A1234GC'
      req.body = { reference: goalReference, title: 'Learn German' }

      errors = [{ href: '#reason', text: 'bang!' }]
      mockedValidateArchiveGoalForm.mockReturnValue(errors)

      const expectedArchiveGoalForm: ArchiveGoalForm = { reference: goalReference, title: 'Learn German' }

      // When
      await controller.submitArchiveGoalForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/plan/${prisonNumber}/goals/${goalReference}/archive`,
        errors,
      )
      expect(getPrisonerContext(req.session, prisonNumber).archiveGoalForm).toEqual(expectedArchiveGoalForm)
      expect(educationAndWorkPlanService.archiveGoal).not.toHaveBeenCalled()
    })
  })

  describe('getReviewArchiveGoalView', () => {
    it('should get the view with the form in the session', async () => {
      // Given
      const expectedForm: ArchiveGoalForm = {
        reference: goalReference,
        title: 'Some goal',
        reason: ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL,
      }
      const expectedView = {
        prisonerSummary,
        form: expectedForm,
      }
      getPrisonerContext(req.session, prisonNumber).archiveGoalForm = expectedForm

      // When
      await controller.getReviewArchiveGoalView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/goal/archive/review', expectedView)
    })

    it('should redirect back to the archive reason page if no form in the session', async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).archiveGoalForm = undefined

      // When
      await controller.getReviewArchiveGoalView(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/${goalReference}/archive`)
    })
  })

  describe('submitReviewArchiveGoal', () => {
    it('should request the goal is archived', async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).archiveGoalForm = {
        reference: goalReference,
        title: 'Some goal',
        reason: ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL,
      }
      const expectedArchiveGoalDto: ArchiveGoalDto = {
        prisonNumber,
        goalReference,
        reason: ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL,
        prisonId,
      }
      mockedArchiveGoalFormToArchiveGoalDtoMapper.mockReturnValue(expectedArchiveGoalDto)

      const expectedBaseAuditData: BaseAuditData = {
        correlationId: requestId,
        details: { goalReference },
        subjectId: prisonNumber,
        subjectType: 'PRISONER_ID',
        who: username,
      }

      // When
      await controller.submitReviewArchiveGoal(req, res, next)

      // Then
      expect(educationAndWorkPlanService.archiveGoal).toHaveBeenCalledWith(expectedArchiveGoalDto, username)
      expect(res.redirectWithSuccess).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`, 'Goal archived')
      expect(getPrisonerContext(req.session, prisonNumber).archiveGoalForm).toBeUndefined()
      expect(auditService.logArchiveGoal).toHaveBeenCalledWith(expectedBaseAuditData)
      expect(flash).toHaveBeenCalledWith('pendingRedirectAtEndOfJourney', 'true')
    })

    it('should handle a failure archiving the goal', async () => {
      // Given
      const archiveGoalForm = {
        reference: goalReference,
        title: 'Some goal',
        reason: ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL,
      }
      getPrisonerContext(req.session, prisonNumber).archiveGoalForm = archiveGoalForm
      const expectedArchiveGoalDto: ArchiveGoalDto = {
        prisonNumber,
        goalReference,
        reason: ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL,
        prisonId,
      }
      mockedArchiveGoalFormToArchiveGoalDtoMapper.mockReturnValue(expectedArchiveGoalDto)
      educationAndWorkPlanService.archiveGoal.mockRejectedValue(createError(500, 'Service unavailable'))

      // When
      await controller.submitReviewArchiveGoal(req, res, next)

      // Then
      expect(educationAndWorkPlanService.archiveGoal).toHaveBeenCalledWith(expectedArchiveGoalDto, username)
      expect(res.redirect).toHaveBeenCalledWith('review')
      expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
      expect(getPrisonerContext(req.session, prisonNumber).archiveGoalForm).toEqual(archiveGoalForm)
      expect(auditService.logArchiveGoal).not.toHaveBeenCalled()
    })
  })

  describe('cancelArchiveGoal', () => {
    it('should remove the form from the session on cancel', async () => {
      // Given
      getPrisonerContext(req.session, prisonNumber).archiveGoalForm = {
        reference: goalReference,
        title: 'Some goal',
        reason: ReasonToArchiveGoalValue.PRISONER_NO_LONGER_WANTS_TO_WORK_TOWARDS_GOAL,
      }

      // When
      await controller.cancelArchiveGoal(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`)
      expect(getPrisonerContext(req.session, prisonNumber).archiveGoalForm).toBeUndefined()
      expect(auditService.logArchiveGoal).not.toHaveBeenCalled()
      expect(educationAndWorkPlanService.archiveGoal).not.toHaveBeenCalled()
    })
  })
})
