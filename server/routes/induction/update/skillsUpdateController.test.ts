import createError from 'http-errors'
import type { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import type { PageFlow } from 'viewModels'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import validateSkillsForm from './skillsFormValidator'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import { aLongQuestionSetUpdateInductionRequest } from '../../../testsupport/updateInductionRequestTestDataBuilder'
import SkillsUpdateController from './skillsUpdateController'
import SkillsValue from '../../../enums/skillsValue'

jest.mock('./skillsFormValidator')
jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('skillsUpdateController', () => {
  const mockedFormValidator = validateSkillsForm as jest.MockedFunction<typeof validateSkillsForm>
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const controller = new SkillsUpdateController(inductionService)

  const prisonNumber = 'A1234BC'

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    flash: jest.fn(),
    path: '',
  }
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  let errors: Array<Record<string, string>>

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = {} as Record<string, string>
    req.params.prisonNumber = prisonNumber
    req.path = `/prisoners/${prisonNumber}/induction/skills`

    errors = []
  })

  describe('getSkillsView', () => {
    it('should get the Skills view given there is no SkillsForm on the session', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.skillsForm = undefined

      const expectedSkillsForm = {
        skills: ['TEAMWORK', 'WILLINGNESS_TO_LEARN', 'OTHER'],
        skillsOther: 'Tenacity',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedSkillsForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
      }

      // When
      await controller.getSkillsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/skills/index', expectedView)
      expect(req.session.skillsForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Skills view given there is an SkillsForm already on the session', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const expectedSkillsForm = {
        skills: ['SELF_MANAGEMENT', 'TEAMWORK', 'THINKING_AND_PROBLEM_SOLVING'],
        skillsOther: '',
      }
      req.session.skillsForm = expectedSkillsForm

      const expectedView = {
        prisonerSummary,
        form: expectedSkillsForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors,
      }

      // When
      await controller.getSkillsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/skills/index', expectedView)
      expect(req.session.skillsForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Skills view given there is an updateInductionQuestionSet on the session', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.updateInductionQuestionSet = {
        hopingToWorkOnRelease: 'YES',
      }
      req.session.pageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/induction/work-interest-roles`],
        currentPageIndex: 0,
      }

      const expectedSkillsForm = {
        skills: ['SELF_MANAGEMENT', 'TEAMWORK', 'THINKING_AND_PROBLEM_SOLVING'],
        skillsOther: '',
      }
      req.session.skillsForm = expectedSkillsForm

      const expectedView = {
        prisonerSummary,
        form: expectedSkillsForm,
        backLinkUrl: '/prisoners/A1234BC/induction/work-interest-roles',
        backLinkAriaText: 'Back to Is Jimmy Lightfingers interested in any particular jobs?',
        errors,
      }

      const expectedPageFlowHistory = {
        pageUrls: ['/prisoners/A1234BC/induction/work-interest-roles', '/prisoners/A1234BC/induction/skills'],
        currentPageIndex: 1,
      }

      // When
      await controller.getSkillsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/skills/index', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitSkillsForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const invalidSkillsForm = {
        skills: ['OTHER'],
        skillsOther: '',
      }
      req.body = invalidSkillsForm
      req.session.skillsForm = undefined

      errors = [{ href: '#skillsOther', text: 'Enter the skill that Jimmy Lightfingers feels they have' }]
      mockedFormValidator.mockReturnValue(errors)

      // When
      await controller.submitSkillsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/skills')
      expect(req.flash).toHaveBeenCalledWith('errors', errors)
      expect(req.session.skillsForm).toEqual(invalidSkillsForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to work and interests page', async () => {
      // Given
      req.user.token = 'some-token'

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const skillsForm = {
        skills: ['TEAMWORK', 'OTHER'],
        skillsOther: 'Circus skills',
      }
      req.body = skillsForm
      req.session.skillsForm = undefined
      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      mockedFormValidator.mockReturnValue(errors)
      const expectedUpdatedSkills = [
        {
          skillType: 'TEAMWORK',
          skillTypeOther: undefined,
        },
        {
          skillType: 'OTHER',
          skillTypeOther: 'Circus skills',
        },
      ]

      // When
      await controller.submitSkillsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.personalSkillsAndInterests.skills).toEqual(expectedUpdatedSkills)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(req.session.skillsForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should update InductionDto and redirect to Personal Interests given long question set journey', async () => {
      // Given
      req.user.token = 'some-token'

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const skillsForm = {
        skills: ['TEAMWORK', 'OTHER'],
        skillsOther: 'Circus skills',
      }
      req.body = skillsForm
      req.session.skillsForm = undefined

      mockedFormValidator.mockReturnValue(errors)

      req.session.updateInductionQuestionSet = { hopingToWorkOnRelease: 'YES' }
      const expectedNextPage = '/prisoners/A1234BC/induction/personal-interests'

      const expectedUpdatedSkills = [
        {
          skillType: 'TEAMWORK',
          skillTypeOther: undefined,
        },
        {
          skillType: 'OTHER',
          skillTypeOther: 'Circus skills',
        },
      ]

      const expectedPageFlowHistory: PageFlow = {
        pageUrls: ['/prisoners/A1234BC/induction/skills'],
        currentPageIndex: 0,
      }

      // When
      await controller.submitSkillsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(req.session.inductionDto.personalSkillsAndInterests.skills).toEqual(expectedUpdatedSkills)
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.workInterestTypesForm).toBeUndefined()
      expect(inductionService.updateInduction).not.toHaveBeenCalled()
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      req.user.token = 'some-token'

      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const skillsForm = {
        skills: ['TEAMWORK', 'OTHER'],
        skillsOther: 'Circus skills',
      }
      req.body = skillsForm
      req.session.skillsForm = undefined
      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)
      mockedFormValidator.mockReturnValue(errors)
      const expectedUpdatedSkills = [
        {
          skillType: 'TEAMWORK',
          skillTypeOther: undefined,
        },
        {
          skillType: 'OTHER',
          skillTypeOther: 'Circus skills',
        },
      ]

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitSkillsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.personalSkillsAndInterests.skills).toEqual(expectedUpdatedSkills)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.skillsForm).toEqual(skillsForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update induction DTO and redirect back to check your answers page when coming from check your answers', async () => {
      // Given
      const prisonerSummary = aValidPrisonerSummary()
      req.session.prisonerSummary = prisonerSummary
      req.session.inductionDto = aLongQuestionSetInductionDto()
      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonerSummary.prisonNumber}/induction/check-your-answers`,
          `/prisoners/${prisonerSummary.prisonNumber}/induction/skills`,
        ],
        currentPageIndex: 1,
      }

      req.body = {
        skills: [SkillsValue.POSITIVE_ATTITUDE, SkillsValue.RESILIENCE],
      }

      // The actual implementations are fine for this test
      const actualToCreateOrUpdateInductionDto = jest.requireActual(
        '../../../data/mappers/createOrUpdateInductionDtoMapper',
      ).default
      mockedCreateOrUpdateInductionDtoMapper.mockImplementation(actualToCreateOrUpdateInductionDto)
      const actualSkillsFormValidator = jest.requireActual('./skillsFormValidator').default
      mockedFormValidator.mockImplementation(actualSkillsFormValidator)

      // When
      await controller.submitSkillsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(req.session.inductionDto.personalSkillsAndInterests.skills).toEqual([
        { skillType: SkillsValue.POSITIVE_ATTITUDE },
        { skillType: SkillsValue.RESILIENCE },
      ])
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonerSummary.prisonNumber}/induction/check-your-answers`,
      )
    })
  })
})
