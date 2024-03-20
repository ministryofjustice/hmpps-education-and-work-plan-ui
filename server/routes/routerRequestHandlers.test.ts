import createError from 'http-errors'
import { NextFunction, Response, Request } from 'express'
import { SessionData } from 'express-session'
import type { UpdateGoalForm } from 'forms'
import type { NewGoal } from 'compositeForms'
import type { PageFlowQueue } from 'viewModels'
import type { InductionDto } from 'inductionDto'
import type {
  AdditionalTrainingForm,
  AffectAbilityToWorkForm,
  HighestLevelOfEducationForm,
  HopingToWorkOnReleaseForm,
  InPrisonTrainingForm,
  InPrisonWorkForm,
  PersonalInterestsForm,
  PreviousWorkExperienceDetailForm,
  PreviousWorkExperienceTypesForm,
  QualificationDetailsForm,
  QualificationLevelForm,
  ReasonsNotToGetWorkForm,
  SkillsForm,
  WantToAddQualificationsForm,
  WorkedBeforeForm,
  WorkInterestRolesForm,
  WorkInterestTypesForm,
} from 'inductionForms'
import {
  checkCreateGoalFormExistsInSession,
  checkAddStepFormsArrayExistsInSession,
  checkPrisonerSummaryExistsInSession,
  checkUpdateGoalFormExistsInSession,
  checkNewGoalsFormExistsInSession,
  removeInductionFormsFromSession,
  retrievePrisonerSummaryIfNotInSession,
  retrieveInductionIfNotInSession,
  setCurrentPageInPageFlowQueue,
  retrieveFunctionalSkillsIfNotInSession,
} from './routerRequestHandlers'
import { aValidAddStepForm } from '../testsupport/addStepFormTestDataBuilder'
import aValidPrisonerSummary from '../testsupport/prisonerSummaryTestDataBuilder'
import { aValidCreateGoalForm } from '../testsupport/createGoalFormTestDataBuilder'
import aValidAddNoteForm from '../testsupport/addNoteFormTestDataBuilder'
import { CuriousService, InductionService, PrisonerSearchService } from '../services'
import aValidNewGoalForm from '../testsupport/newGoalFormTestDataBuilder'
import { aShortQuestionSetInductionDto } from '../testsupport/inductionDtoTestDataBuilder'
import { setCurrentPageIndex } from './pageFlowQueue'
import {
  functionalSkillsWithProblemRetrievingData,
  validFunctionalSkills,
} from '../testsupport/functionalSkillsTestDataBuilder'

jest.mock('./pageFlowQueue')

describe('routerRequestHandlers', () => {
  const mockCurrentPageIndexSetter = setCurrentPageIndex as jest.MockedFunction<typeof setCurrentPageIndex>

  const req = {
    user: {} as Express.User,
    session: {} as SessionData,
    params: {} as Record<string, string>,
    query: {} as Record<string, string>,
    path: '',
  }
  const res = {
    redirect: jest.fn(),
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.user = {} as Express.User
    req.session = {} as SessionData
    req.params = {} as Record<string, string>
    req.query = {} as Record<string, string>
    req.path = ''
  })

  describe('checkCreateGoalFormExistsInSession', () => {
    describe('edit mode', () => {
      const prisonNumber = 'A1234BC'
      beforeEach(() => {
        req.query.mode = 'edit'
      })

      it(`should invoke next handler given form exists in session for goal and prisoner referenced in url params`, async () => {
        // Given
        req.params.prisonNumber = prisonNumber
        req.params.goalIndex = '1'

        req.session.newGoals = [
          aValidNewGoalForm({ createGoalForm: aValidCreateGoalForm({ prisonNumber }) }),
          aValidNewGoalForm({ createGoalForm: aValidCreateGoalForm({ prisonNumber }) }),
          aValidNewGoalForm({ createGoalForm: aValidCreateGoalForm({ prisonNumber }) }),
        ]

        // When
        await checkCreateGoalFormExistsInSession(
          req as undefined as Request,
          res as undefined as Response,
          next as undefined as NextFunction,
        )

        // Then
        expect(next).toHaveBeenCalled()
        expect(res.redirect).not.toHaveBeenCalled()
      })
    })

    describe('non-edit mode', () => {
      beforeEach(() => {
        req.query = {}
      })

      it(`should invoke next handler given form exists in session for prisoner referenced in url params`, async () => {
        // Given
        const prisonNumber = 'A1234BC'
        req.params.prisonNumber = prisonNumber

        req.session.newGoal = aValidNewGoalForm({
          createGoalForm: aValidCreateGoalForm({ prisonNumber }),
        })

        // When
        await checkCreateGoalFormExistsInSession(
          req as undefined as Request,
          res as undefined as Response,
          next as undefined as NextFunction,
        )

        // Then
        expect(next).toHaveBeenCalled()
        expect(res.redirect).not.toHaveBeenCalled()
      })

      it(`should redirect to Create Goal screen given no newGoal form exists in session`, async () => {
        // Given
        const prisonNumber = 'A1234BC'
        req.params.prisonNumber = prisonNumber

        req.session.newGoal = undefined

        // When
        await checkCreateGoalFormExistsInSession(
          req as undefined as Request,
          res as undefined as Response,
          next as undefined as NextFunction,
        )

        // Then
        expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/1/create`)
        expect(next).not.toHaveBeenCalled()
      })

      it(`should redirect to Create Goal screen given no createGoalForm form exists in session`, async () => {
        // Given
        const prisonNumber = 'A1234BC'
        req.params.prisonNumber = prisonNumber

        req.session.newGoal = {
          createGoalForm: undefined,
        } as NewGoal

        // When
        await checkCreateGoalFormExistsInSession(
          req as undefined as Request,
          res as undefined as Response,
          next as undefined as NextFunction,
        )

        // Then
        expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/1/create`)
        expect(next).not.toHaveBeenCalled()
      })

      it(`should redirect to Create Goal screen given form exists in session but for different prisoner`, async () => {
        // Given
        const prisonNumber = 'A1234BC'
        req.params.prisonNumber = prisonNumber

        req.session.newGoal = aValidNewGoalForm({
          createGoalForm: aValidCreateGoalForm({ prisonNumber: 'Z9999XZ' }),
        })

        // When
        await checkCreateGoalFormExistsInSession(
          req as undefined as Request,
          res as undefined as Response,
          next as undefined as NextFunction,
        )

        // Then
        expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/1/create`)
        expect(req.session.newGoal.createGoalForm).toBeUndefined()
        expect(next).not.toHaveBeenCalled()
      })
    })
  })

  describe('checkAddStepFormsArrayExistsInSession', () => {
    it(`should invoke next handler given forms array exists in session and contains at least 1 element`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoal = {
        addStepForms: [aValidAddStepForm()],
      } as NewGoal

      // When
      await checkAddStepFormsArrayExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(next).toHaveBeenCalled()
      expect(res.redirect).not.toHaveBeenCalled()
    })

    it(`should redirect to Create Goal screen given no forms array exists in session`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoal = {
        addStepForms: undefined,
      } as NewGoal

      // When
      await checkAddStepFormsArrayExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/1/create`)
      expect(next).not.toHaveBeenCalled()
    })

    it(`should redirect to Add Step screen given empty forms array exists in session`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoal = {
        addStepForms: [],
      } as NewGoal

      // When
      await checkAddStepFormsArrayExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/1/add-step/1`)
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('checkPrisonerSummaryExistsInSession', () => {
    it(`should invoke next handler given prisoner summary exists in session for prisoner referenced in url params`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.prisonerSummary = aValidPrisonerSummary(prisonNumber)

      // When
      await checkPrisonerSummaryExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(next).toHaveBeenCalled()
      expect(res.redirect).not.toHaveBeenCalled()
    })

    it(`should redirect to Overview screen given no prisoner summary exists in session`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.prisonerSummary = undefined

      // When
      await checkPrisonerSummaryExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`)
      expect(next).not.toHaveBeenCalled()
    })

    it(`should redirect to Overview screen given prisoner summary exists in session but for different prisoner`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.prisonerSummary = aValidPrisonerSummary('Z9999XZ')

      // When
      await checkPrisonerSummaryExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`)
      expect(req.session.newGoal).toBeUndefined()
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('checkUpdateGoalFormExistsInSession', () => {
    it(`should invoke next handler given update goal form exists in session`, async () => {
      // Given
      const reference = '1a2eae63-8102-4155-97cb-43d8fb739caf'

      req.session.updateGoalForm = {
        reference,
      } as UpdateGoalForm

      // When
      await checkUpdateGoalFormExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(next).toHaveBeenCalled()
      expect(res.redirect).not.toHaveBeenCalled()
    })

    it(`should redirect to Overview page given no update goal form exists in session`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.updateGoalForm = undefined

      // When
      await checkUpdateGoalFormExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/overview`)
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('checkNewGoalsFormExistsInSession', () => {
    it(`should invoke next handler given NewGoal array exists in session with at least 1 element`, async () => {
      // Given
      req.session.newGoals = [
        {
          createGoalForm: aValidCreateGoalForm(),
          addStepForms: [aValidAddStepForm()],
          addNoteForm: aValidAddNoteForm(),
        },
      ] as Array<NewGoal>

      // When
      await checkNewGoalsFormExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(next).toHaveBeenCalled()
      expect(res.redirect).not.toHaveBeenCalled()
    })

    it(`should redirect to Create Goal screen given no NewGoal array exists in session`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoals = undefined

      // When
      await checkNewGoalsFormExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/1/create`)
      expect(next).not.toHaveBeenCalled()
    })

    it(`should redirect to Add Note screen given an empty NewGoal array exists in session`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoals = []

      // When
      await checkNewGoalsFormExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/1/add-note`)
      expect(next).not.toHaveBeenCalled()
    })

    it(`should redirect to Add Note screen given NewGoal array exists in session with at least 1 element that has no AddNoteForm`, async () => {
      // Given
      const prisonNumber = 'A1234BC'
      req.params.prisonNumber = prisonNumber

      req.session.newGoals = [
        {
          createGoalForm: aValidCreateGoalForm(),
          addStepForms: [aValidAddStepForm()],
          addNoteForm: undefined,
        },
      ] as Array<NewGoal>

      // When
      await checkNewGoalsFormExistsInSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/goals/1/add-note`)
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('retrievePrisonerSummaryIfNotInSession', () => {
    const prisonerSearchService = {
      getPrisonerByPrisonNumber: jest.fn(),
    }

    const requestHandler = retrievePrisonerSummaryIfNotInSession(
      prisonerSearchService as unknown as PrisonerSearchService,
    )

    it('should retrieve prisoner and store in session given prisoner not in session', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username

      req.session.prisonerSummary = undefined

      const prisonNumber = 'A1234GC'
      const prisonId = 'MDI'
      req.params.prisonNumber = prisonNumber
      const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber, prisonId)
      prisonerSearchService.getPrisonerByPrisonNumber.mockResolvedValue(expectedPrisonerSummary)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(prisonerSearchService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
      expect(req.session.prisonerSummary).toEqual(expectedPrisonerSummary)
      expect(next).toHaveBeenCalled()
    })

    it('should retrieve prisoner and store in session given different prisoner already in session', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username

      req.session.prisonerSummary = aValidPrisonerSummary('Z1234XY', 'BXI')

      const prisonNumber = 'A1234GC'
      const prisonId = 'MDI'
      req.params.prisonNumber = prisonNumber
      const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber, prisonId)
      prisonerSearchService.getPrisonerByPrisonNumber.mockResolvedValue(expectedPrisonerSummary)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(prisonerSearchService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
      expect(req.session.prisonerSummary).toEqual(expectedPrisonerSummary)
      expect(next).toHaveBeenCalled()
    })

    it('should not retrieve prisoner given prisoner already in session', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username

      const prisonNumber = 'A1234GC'
      const prisonId = 'MDI'

      req.session.prisonerSummary = aValidPrisonerSummary(prisonNumber, prisonId)

      req.params.prisonNumber = prisonNumber
      const expectedPrisonerSummary = aValidPrisonerSummary(prisonNumber, prisonId)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(prisonerSearchService.getPrisonerByPrisonNumber).not.toHaveBeenCalled()
      expect(req.session.prisonerSummary).toEqual(expectedPrisonerSummary)
      expect(next).toHaveBeenCalled()
    })

    it('should call next function with error given retrieving prisoner fails with a 404', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username

      req.session.prisonerSummary = undefined

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber

      prisonerSearchService.getPrisonerByPrisonNumber.mockRejectedValue(createError(404, 'Not Found'))
      const expectedError = createError(404, `Prisoner ${prisonNumber} not returned by the Prisoner Search Service API`)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(prisonerSearchService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
      expect(req.session.prisonerSummary).toBeUndefined()
      expect(next).toHaveBeenCalledWith(expectedError)
    })

    it('should call next function with error given retrieving prisoner fails with a 500', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username

      req.session.prisonerSummary = undefined

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber

      prisonerSearchService.getPrisonerByPrisonNumber.mockRejectedValue(createError(500, 'Not Found'))
      const expectedError = createError(500, `Prisoner ${prisonNumber} not returned by the Prisoner Search Service API`)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(prisonerSearchService.getPrisonerByPrisonNumber).toHaveBeenCalledWith(prisonNumber, username)
      expect(req.session.prisonerSummary).toBeUndefined()
      expect(next).toHaveBeenCalledWith(expectedError)
    })
  })

  describe('retrieveInductionIfNotInSession', () => {
    const inductionService = {
      getInduction: jest.fn(),
    }

    const requestHandler = retrieveInductionIfNotInSession(inductionService as unknown as InductionService)

    it('should retrieve induction and store in session given induction not in session', async () => {
      // Given
      const token = 'a-user-token'
      req.user.token = token

      req.session.inductionDto = undefined

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber
      const expectedInductionDto = aShortQuestionSetInductionDto({ prisonNumber })
      inductionService.getInduction.mockResolvedValue(expectedInductionDto)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, token)
      expect(req.session.inductionDto).toEqual(expectedInductionDto)
      expect(next).toHaveBeenCalled()
    })

    it(`should retrieve induction and store in session given different prisoner's induction already in session`, async () => {
      // Given
      const token = 'a-user-token'
      req.user.token = token

      req.session.inductionDto = aShortQuestionSetInductionDto({ prisonNumber: 'Z1234XY' })

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber
      const expectedInductionDto = aShortQuestionSetInductionDto({ prisonNumber })
      inductionService.getInduction.mockResolvedValue(expectedInductionDto)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, token)
      expect(req.session.inductionDto).toEqual(expectedInductionDto)
      expect(next).toHaveBeenCalled()
    })

    it(`should not retrieve induction given prisoner's induction already in session`, async () => {
      // Given
      const token = 'a-user-token'
      req.user.token = token

      const prisonNumber = 'A1234GC'

      req.session.inductionDto = aShortQuestionSetInductionDto({ prisonNumber })

      req.params.prisonNumber = prisonNumber
      const expectedInductionDto = aShortQuestionSetInductionDto({ prisonNumber })

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(inductionService.getInduction).not.toHaveBeenCalled()
      expect(req.session.inductionDto).toEqual(expectedInductionDto)
      expect(next).toHaveBeenCalled()
    })

    it('should call next function with error given retrieving induction fails with a 404', async () => {
      // Given
      const token = 'a-user-token'
      req.user.token = token

      req.session.inductionDto = undefined

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber

      inductionService.getInduction.mockRejectedValue(createError(404, 'Not Found'))
      const expectedError = createError(
        404,
        `Induction for prisoner ${prisonNumber} not returned by the Induction Service`,
      )

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, token)
      expect(req.session.inductionDto).toBeUndefined()
      expect(next).toHaveBeenCalledWith(expectedError)
    })

    it('should call next function with error given retrieving induction fails with a 500', async () => {
      // Given
      const token = 'a-user-token'
      req.user.token = token

      req.session.inductionDto = undefined

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber

      inductionService.getInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Induction for prisoner ${prisonNumber} not returned by the Induction Service`,
      )

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(inductionService.getInduction).toHaveBeenCalledWith(prisonNumber, token)
      expect(req.session.prisonerSummary).toBeUndefined()
      expect(next).toHaveBeenCalledWith(expectedError)
    })
  })

  describe('removeInductionFormsFromSession', () => {
    it('should remove induction forms from session', async () => {
      // Given
      req.session.pageFlowQueue = {} as PageFlowQueue
      req.session.inductionDto = {} as InductionDto
      req.session.hopingToWorkOnReleaseForm = {} as HopingToWorkOnReleaseForm
      req.session.inPrisonWorkForm = {} as InPrisonWorkForm
      req.session.skillsForm = {} as SkillsForm
      req.session.personalInterestsForm = {} as PersonalInterestsForm
      req.session.workedBeforeForm = {} as WorkedBeforeForm
      req.session.previousWorkExperienceTypesForm = {} as PreviousWorkExperienceTypesForm
      req.session.previousWorkExperienceDetailForm = {} as PreviousWorkExperienceDetailForm
      req.session.affectAbilityToWorkForm = {} as AffectAbilityToWorkForm
      req.session.reasonsNotToGetWorkForm = {} as ReasonsNotToGetWorkForm
      req.session.workInterestTypesForm = {} as WorkInterestTypesForm
      req.session.workInterestRolesForm = {} as WorkInterestRolesForm
      req.session.inPrisonTrainingForm = {} as InPrisonTrainingForm
      req.session.wantToAddQualificationsForm = {} as WantToAddQualificationsForm
      req.session.highestLevelOfEducationForm = {} as HighestLevelOfEducationForm
      req.session.qualificationLevelForm = {} as QualificationLevelForm
      req.session.qualificationDetailsForm = {} as QualificationDetailsForm
      req.session.additionalTrainingForm = {} as AdditionalTrainingForm

      // When
      await removeInductionFormsFromSession(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(next).toHaveBeenCalled()
      expect(req.session.pageFlowQueue).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
      expect(req.session.hopingToWorkOnReleaseForm).toBeUndefined()
      expect(req.session.inPrisonWorkForm).toBeUndefined()
      expect(req.session.skillsForm).toBeUndefined()
      expect(req.session.personalInterestsForm).toBeUndefined()
      expect(req.session.workedBeforeForm).toBeUndefined()
      expect(req.session.previousWorkExperienceTypesForm).toBeUndefined()
      expect(req.session.previousWorkExperienceDetailForm).toBeUndefined()
      expect(req.session.affectAbilityToWorkForm).toBeUndefined()
      expect(req.session.reasonsNotToGetWorkForm).toBeUndefined()
      expect(req.session.workInterestTypesForm).toBeUndefined()
      expect(req.session.workInterestRolesForm).toBeUndefined()
      expect(req.session.inPrisonTrainingForm).toBeUndefined()
      expect(req.session.wantToAddQualificationsForm).toBeUndefined()
      expect(req.session.highestLevelOfEducationForm).toBeUndefined()
      expect(req.session.qualificationLevelForm).toBeUndefined()
      expect(req.session.qualificationDetailsForm).toBeUndefined()
      expect(req.session.additionalTrainingForm).toBeUndefined()
    })
  })

  describe('setCurrentPageInPageFlowQueue', () => {
    it('should set the current page in page flow queue given there is a PageFlowQueue on the session', async () => {
      // Given
      const initialPageFlowQueue: PageFlowQueue = {
        pageUrls: ['/first-page', '/second-page', '/third-page'],
        currentPageIndex: 0,
      }
      req.session.pageFlowQueue = initialPageFlowQueue
      req.path = '/second-page'

      const expectedPageFlowQueue: PageFlowQueue = {
        pageUrls: ['/first-page', '/second-page', '/third-page'],
        currentPageIndex: 1,
      }
      mockCurrentPageIndexSetter.mockReturnValue(expectedPageFlowQueue)

      // When
      await setCurrentPageInPageFlowQueue(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(next).toHaveBeenCalled()
      expect(req.session.pageFlowQueue).toEqual(expectedPageFlowQueue)
      expect(mockCurrentPageIndexSetter).toHaveBeenCalledWith(initialPageFlowQueue, '/second-page')
    })

    it('should not set the current page in page flow queue given there is no PageFlowQueue on the session', async () => {
      // Given
      req.session.pageFlowQueue = undefined

      // When
      await setCurrentPageInPageFlowQueue(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(next).toHaveBeenCalled()
      expect(req.session.pageFlowQueue).toBeUndefined()
    })
  })

  describe('retrieveFunctionalSkillsIfNotInSession', () => {
    const curiousService = {
      getPrisonerFunctionalSkills: jest.fn(),
    }

    const requestHandler = retrieveFunctionalSkillsIfNotInSession(curiousService as unknown as CuriousService)

    it('should retrieve prisoner functional skills and store in session given functional skills not in session', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username

      req.session.prisonerFunctionalSkills = undefined

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber
      const expectedFunctionalSkills = validFunctionalSkills({ prisonNumber })
      curiousService.getPrisonerFunctionalSkills.mockResolvedValue(expectedFunctionalSkills)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(curiousService.getPrisonerFunctionalSkills).toHaveBeenCalledWith(prisonNumber, username)
      expect(req.session.prisonerFunctionalSkills).toEqual(expectedFunctionalSkills)
      expect(next).toHaveBeenCalled()
    })

    it('should retrieve prisoner functional skills and store in session given functional skills for a different prisoner already in session', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username

      req.session.prisonerFunctionalSkills = validFunctionalSkills({ prisonNumber: 'Z1234XY' })

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber
      const expectedFunctionalSkills = validFunctionalSkills({ prisonNumber })
      curiousService.getPrisonerFunctionalSkills.mockResolvedValue(expectedFunctionalSkills)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(curiousService.getPrisonerFunctionalSkills).toHaveBeenCalledWith(prisonNumber, username)
      expect(req.session.prisonerFunctionalSkills).toEqual(expectedFunctionalSkills)
      expect(next).toHaveBeenCalled()
    })

    it('should not retrieve prisoner functional skills given functional skills for prisoner already in session', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username

      const prisonNumber = 'A1234GC'

      req.session.prisonerFunctionalSkills = validFunctionalSkills({ prisonNumber })

      req.params.prisonNumber = prisonNumber
      const expectedFunctionalSkills = validFunctionalSkills({ prisonNumber })

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(curiousService.getPrisonerFunctionalSkills).not.toHaveBeenCalled()
      expect(req.session.prisonerFunctionalSkills).toEqual(expectedFunctionalSkills)
      expect(next).toHaveBeenCalled()
    })

    it('should retrieve prisoner functional skills and store in session given functional skills with problem retrieving data already in session', async () => {
      // Given
      const username = 'a-dps-user'
      req.user.username = username

      const prisonNumber = 'A1234GC'
      req.params.prisonNumber = prisonNumber

      req.session.prisonerFunctionalSkills = functionalSkillsWithProblemRetrievingData({ prisonNumber })
      const expectedFunctionalSkills = validFunctionalSkills({ prisonNumber })
      curiousService.getPrisonerFunctionalSkills.mockResolvedValue(expectedFunctionalSkills)

      // When
      await requestHandler(req as undefined as Request, res as undefined as Response, next as undefined as NextFunction)

      // Then
      expect(curiousService.getPrisonerFunctionalSkills).toHaveBeenCalledWith(prisonNumber, username)
      expect(req.session.prisonerFunctionalSkills).toEqual(expectedFunctionalSkills)
      expect(next).toHaveBeenCalled()
    })
  })
})
