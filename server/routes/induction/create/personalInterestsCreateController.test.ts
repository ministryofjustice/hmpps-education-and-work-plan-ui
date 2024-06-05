import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { PersonalInterestsForm } from 'inductionForms'
import type { PersonalInterestDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import {
  aLongQuestionSetInductionDto,
  aShortQuestionSetInductionDto,
} from '../../../testsupport/inductionDtoTestDataBuilder'
import PersonalInterestsCreateController from './personalInterestsCreateController'
import PersonalInterestsValue from '../../../enums/personalInterestsValue'

describe('personalInterestsCreateController', () => {
  const controller = new PersonalInterestsCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {} as SessionData,
    body: {},
    user: {} as Express.User,
    params: {} as Record<string, string>,
    path: '',
  }
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session = { prisonerSummary } as SessionData
    req.body = {}
    req.user = {} as Express.User
    req.params = { prisonNumber }
    req.path = `/prisoners/${prisonNumber}/create-induction/personal-interests`
  })

  describe('getPersonalInterestsView', () => {
    it('should get the Personal interests view given there is no PersonalInterestsForm on the session', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      req.session.inductionDto = inductionDto
      req.session.personalInterestsForm = undefined

      const expectedPersonalInterestsForm: PersonalInterestsForm = {
        personalInterests: [],
        personalInterestsOther: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedPersonalInterestsForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/skills',
        backLinkAriaText: 'Back to What skills does Jimmy Lightfingers feel they have?',
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
      inductionDto.personalSkillsAndInterests.interests = undefined
      req.session.inductionDto = inductionDto

      const expectedPersonalInterestsForm: PersonalInterestsForm = {
        personalInterests: ['COMMUNITY', 'CREATIVE', 'MUSICAL'],
        personalInterestsOther: '',
      }
      req.session.personalInterestsForm = expectedPersonalInterestsForm

      const expectedView = {
        prisonerSummary,
        form: expectedPersonalInterestsForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/skills',
        backLinkAriaText: 'Back to What skills does Jimmy Lightfingers feel they have?',
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

    it('should get the Ability To Work view given the previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: ['/prisoners/A1234BC/create-induction/check-your-answers'],
        currentPageIndex: 0,
      }

      const expectedPageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/personal-interests',
        ],
        currentPageIndex: 1,
      }

      const expectedPersonalInterestsForm: PersonalInterestsForm = {
        personalInterests: [],
        personalInterestsOther: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedPersonalInterestsForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/check-your-answers',
        backLinkAriaText: `Back to Check and save your answers before adding Jimmy Lightfingers's goals`,
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
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitPersonalInterestsForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
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
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/prisoners/A1234BC/create-induction/personal-interests',
        expectedErrors,
      )
      expect(req.session.personalInterestsForm).toEqual(invalidPersonalInterestsForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update inductionDto and redirect to factors affecting ability to work page given long question set induction', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      req.session.inductionDto = inductionDto

      const personalInterestsForm = {
        personalInterests: ['CREATIVE', 'OTHER'],
        personalInterestsOther: 'Renewable energy',
      }
      req.body = personalInterestsForm
      req.session.personalInterestsForm = undefined

      const expectedInterests: Array<PersonalInterestDto> = [
        { interestType: PersonalInterestsValue.CREATIVE, interestTypeOther: undefined },
        { interestType: PersonalInterestsValue.OTHER, interestTypeOther: 'Renewable energy' },
      ]

      // When
      await controller.submitPersonalInterestsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.personalSkillsAndInterests.interests).toEqual(expectedInterests)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/affect-ability-to-work')
      expect(req.session.skillsForm).toBeUndefined()
    })

    it('should update inductionDto and redirect to in-prison-work page given short question set induction', async () => {
      // Given
      const inductionDto = aShortQuestionSetInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      req.session.inductionDto = inductionDto

      const personalInterestsForm = {
        personalInterests: ['CREATIVE', 'OTHER'],
        personalInterestsOther: 'Renewable energy',
      }
      req.body = personalInterestsForm
      req.session.personalInterestsForm = undefined

      const expectedInterests: Array<PersonalInterestDto> = [
        { interestType: PersonalInterestsValue.CREATIVE, interestTypeOther: undefined },
        { interestType: PersonalInterestsValue.OTHER, interestTypeOther: 'Renewable energy' },
      ]

      // When
      await controller.submitPersonalInterestsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.personalSkillsAndInterests.interests).toEqual(expectedInterests)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/in-prison-work')
      expect(req.session.skillsForm).toBeUndefined()
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
      inductionDto.personalSkillsAndInterests.interests = undefined
      req.session.inductionDto = inductionDto

      const personalInterestsForm = {
        personalInterests: ['CREATIVE', 'OTHER'],
        personalInterestsOther: 'Renewable energy',
      }
      req.body = personalInterestsForm
      req.session.personalInterestsForm = undefined

      const expectedInterests: Array<PersonalInterestDto> = [
        { interestType: PersonalInterestsValue.CREATIVE, interestTypeOther: undefined },
        { interestType: PersonalInterestsValue.OTHER, interestTypeOther: 'Renewable energy' },
      ]

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/personal-interests',
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.submitPersonalInterestsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.personalSkillsAndInterests.interests).toEqual(expectedInterests)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(req.session.skillsForm).toBeUndefined()
    })
  })
})
