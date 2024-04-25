import createError from 'http-errors'
import type { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import type { PageFlow } from 'viewModels'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import toCreateOrUpdateInductionDto from '../../../data/mappers/createOrUpdateInductionDtoMapper'
import InductionService from '../../../services/inductionService'
import { aLongQuestionSetUpdateInductionRequest } from '../../../testsupport/updateInductionRequestTestDataBuilder'
import PersonalInterestsUpdateController from './personalInterestsUpdateController'

jest.mock('../../../data/mappers/createOrUpdateInductionDtoMapper')
jest.mock('../../../services/inductionService')

describe('personalInterestsUpdateController', () => {
  const mockedCreateOrUpdateInductionDtoMapper = toCreateOrUpdateInductionDto as jest.MockedFunction<
    typeof toCreateOrUpdateInductionDto
  >

  const inductionService = new InductionService(null) as jest.Mocked<InductionService>
  const controller = new PersonalInterestsUpdateController(inductionService)

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const noErrors: Array<Record<string, string>> = []

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

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = { prisonerSummary } as SessionData
    req.body = {}
    req.user = { token: 'some-token' } as Express.User
    req.params = { prisonNumber }
    req.path = `/prisoners/${prisonNumber}/induction/personal-interests`
  })

  describe('getPersonalInterestsView', () => {
    it('should get the Personal interests view given there is no PersonalInterestsForm on the session', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.personalInterestsForm = undefined

      const expectedPersonalInterestsForm = {
        personalInterests: ['CREATIVE', 'DIGITAL', 'OTHER'],
        personalInterestsOther: 'Renewable energy',
      }

      const expectedView = {
        prisonerSummary,
        form: expectedPersonalInterestsForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors: noErrors,
      }

      // When
      await controller.getPersonalInterestsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/personalInterests/index', expectedView)
      expect(req.session.personalInterestsForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Personal interests view given there is an PersonalInterestsForm already on the session', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const expectedPersonalInterestsForm = {
        personalInterests: ['COMMUNITY', 'CREATIVE', 'MUSICAL'],
        personalInterestsOther: '',
      }
      req.session.personalInterestsForm = expectedPersonalInterestsForm

      const expectedView = {
        prisonerSummary,
        form: expectedPersonalInterestsForm,
        backLinkUrl: '/plan/A1234BC/view/work-and-interests',
        backLinkAriaText: `Back to Jimmy Lightfingers's learning and work progress`,
        errors: noErrors,
      }

      // When
      await controller.getPersonalInterestsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/personalInterests/index', expectedView)
      expect(req.session.personalInterestsForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should get the Personal Interests view given there is an updateInductionQuestionSet on the session', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto
      req.session.updateInductionQuestionSet = {
        hopingToWorkOnRelease: 'YES',
      }
      req.session.pageFlowHistory = {
        pageUrls: [`/prisoners/${prisonNumber}/induction/skills`],
        currentPageIndex: 0,
      }

      const expectedPersonalInterestsForm = {
        personalInterests: ['COMMUNITY', 'CREATIVE', 'MUSICAL'],
        personalInterestsOther: '',
      }
      req.session.personalInterestsForm = expectedPersonalInterestsForm

      const expectedView = {
        prisonerSummary,
        form: expectedPersonalInterestsForm,
        backLinkUrl: '/prisoners/A1234BC/induction/skills',
        backLinkAriaText: 'Back to What skills does Jimmy Lightfingers feel they have?',
        errors: noErrors,
      }

      const expectedPageFlowHistory = {
        pageUrls: ['/prisoners/A1234BC/induction/skills', '/prisoners/A1234BC/induction/personal-interests'],
        currentPageIndex: 1,
      }

      // When
      await controller.getPersonalInterestsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/personalInterests/index', expectedView)
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitPersonalInterestsForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const invalidPersonalInterestsForm = {
        personalInterests: ['OTHER'],
        personalInterestsOther: '',
      }
      req.body = invalidPersonalInterestsForm
      req.session.personalInterestsForm = undefined

      const expectedErrors = [{ href: '#personalInterestsOther', text: `Enter Jimmy Lightfingers's interests` }]

      // When
      await controller.submitPersonalInterestsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/induction/personal-interests')
      expect(req.flash).toHaveBeenCalledWith('errors', expectedErrors)
      expect(req.session.personalInterestsForm).toEqual(invalidPersonalInterestsForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update Induction and call API and redirect to work and interests page', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const personalInterestsForm = {
        personalInterests: ['CREATIVE', 'OTHER'],
        personalInterestsOther: 'Renewable energy',
      }
      req.body = personalInterestsForm
      req.session.personalInterestsForm = undefined
      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedPersonalInterests = [
        {
          interestType: 'CREATIVE',
          interestTypeOther: undefined,
        },
        {
          interestType: 'OTHER',
          interestTypeOther: 'Renewable energy',
        },
      ]

      // When
      await controller.submitPersonalInterestsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.personalSkillsAndInterests.interests).toEqual(expectedUpdatedPersonalInterests)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(res.redirect).toHaveBeenCalledWith(`/plan/${prisonNumber}/view/work-and-interests`)
      expect(req.session.personalInterestsForm).toBeUndefined()
      expect(req.session.inductionDto).toBeUndefined()
    })

    it('should update InductionDto and redirect to Factors Affecting Ability To Work given long question set journey', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const personalInterestsForm = {
        personalInterests: ['CREATIVE', 'OTHER'],
        personalInterestsOther: 'Renewable energy',
      }
      req.body = personalInterestsForm
      req.session.personalInterestsForm = undefined

      req.session.updateInductionQuestionSet = { hopingToWorkOnRelease: 'YES' }
      const expectedNextPage = '/prisoners/A1234BC/induction/affect-ability-to-work'

      const expectedUpdatedPersonalInterests = [
        {
          interestType: 'CREATIVE',
          interestTypeOther: undefined,
        },
        {
          interestType: 'OTHER',
          interestTypeOther: 'Renewable energy',
        },
      ]

      const expectedPageFlowHistory: PageFlow = {
        pageUrls: ['/prisoners/A1234BC/induction/personal-interests'],
        currentPageIndex: 0,
      }

      // When
      await controller.submitPersonalInterestsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(req.session.inductionDto.personalSkillsAndInterests.interests).toEqual(expectedUpdatedPersonalInterests)
      expect(res.redirect).toHaveBeenCalledWith(expectedNextPage)
      expect(req.session.workInterestTypesForm).toBeUndefined()
      expect(inductionService.updateInduction).not.toHaveBeenCalled()
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })

    it('should not update Induction given error calling service', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      req.session.inductionDto = inductionDto

      const personalInterestsForm = {
        personalInterests: ['KNOWLEDGE_BASED', 'OTHER'],
        personalInterestsOther: 'Writing poetry and short stories',
      }
      req.body = personalInterestsForm
      req.session.personalInterestsForm = undefined
      const updateInductionDto = aLongQuestionSetUpdateInductionRequest()

      mockedCreateOrUpdateInductionDtoMapper.mockReturnValueOnce(updateInductionDto)

      const expectedUpdatedPersonalInterests = [
        {
          interestType: 'KNOWLEDGE_BASED',
          interestTypeOther: undefined,
        },
        {
          interestType: 'OTHER',
          interestTypeOther: 'Writing poetry and short stories',
        },
      ]

      inductionService.updateInduction.mockRejectedValue(createError(500, 'Service unavailable'))
      const expectedError = createError(
        500,
        `Error updating Induction for prisoner ${prisonNumber}. Error: InternalServerError: Service unavailable`,
      )

      // When
      await controller.submitPersonalInterestsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      // Extract the first call to the mock and the second argument (i.e. the updated Induction)
      const updatedInduction = mockedCreateOrUpdateInductionDtoMapper.mock.calls[0][1]
      expect(mockedCreateOrUpdateInductionDtoMapper).toHaveBeenCalledWith(prisonerSummary.prisonId, updatedInduction)
      expect(updatedInduction.personalSkillsAndInterests.interests).toEqual(expectedUpdatedPersonalInterests)

      expect(inductionService.updateInduction).toHaveBeenCalledWith(prisonNumber, updateInductionDto, 'some-token')
      expect(next).toHaveBeenCalledWith(expectedError)
      expect(req.session.personalInterestsForm).toEqual(personalInterestsForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update induction DTO and redirect back to check your answers page when coming from check your answers', async () => {
      // Given
      req.session.inductionDto = aLongQuestionSetInductionDto()
      req.session.pageFlowHistory = {
        pageUrls: [
          `/prisoners/${prisonerSummary.prisonNumber}/induction/check-your-answers`,
          `/prisoners/${prisonerSummary.prisonNumber}/induction/personal-interests`,
        ],
        currentPageIndex: 1,
      }

      req.body = {
        personalInterests: ['KNOWLEDGE_BASED', 'OTHER'],
        personalInterestsOther: 'Writing poetry and short stories',
      }

      // The actual implementations are fine for this test
      const actualToCreateOrUpdateInductionDto = jest.requireActual(
        '../../../data/mappers/createOrUpdateInductionDtoMapper',
      ).default
      mockedCreateOrUpdateInductionDtoMapper.mockImplementation(actualToCreateOrUpdateInductionDto)

      // When
      await controller.submitPersonalInterestsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(req.session.inductionDto.personalSkillsAndInterests.interests).toEqual([
        { interestType: 'KNOWLEDGE_BASED' },
        { interestType: 'OTHER', interestTypeOther: 'Writing poetry and short stories' },
      ])
      expect(res.redirect).toHaveBeenCalledWith(
        `/prisoners/${prisonerSummary.prisonNumber}/induction/check-your-answers`,
      )
    })
  })
})
