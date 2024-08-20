import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { SkillsForm } from 'inductionForms'
import type { PersonalSkillDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import SkillsCreateController from './skillsCreateController'
import SkillsValue from '../../../enums/skillsValue'

describe('skillsCreateController', () => {
  const controller = new SkillsCreateController()

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
    req.path = `/prisoners/${prisonNumber}/create-induction/skills`
  })

  describe('getSkillsView', () => {
    it('should get the Skills view given there is no SkillsForm on the session', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.skills = undefined
      req.session.inductionDto = inductionDto
      req.session.skillsForm = undefined

      const expectedSkillsForm: SkillsForm = {
        skills: [],
        skillsOther: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedSkillsForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/has-worked-before',
        backLinkAriaText: 'Back to Has Jimmy Lightfingers worked before?',
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
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.skills = undefined
      req.session.inductionDto = inductionDto

      const expectedSkillsForm = {
        skills: ['SELF_MANAGEMENT', 'TEAMWORK', 'THINKING_AND_PROBLEM_SOLVING'],
        skillsOther: '',
      }
      req.session.skillsForm = expectedSkillsForm

      const expectedView = {
        prisonerSummary,
        form: expectedSkillsForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/has-worked-before',
        backLinkAriaText: 'Back to Has Jimmy Lightfingers worked before?',
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

    it('should get the Skills view given the previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.skills = undefined
      req.session.inductionDto = inductionDto

      req.session.pageFlowHistory = {
        pageUrls: ['/prisoners/A1234BC/create-induction/check-your-answers'],
        currentPageIndex: 0,
      }

      const expectedPageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/skills',
        ],
        currentPageIndex: 1,
      }

      const expectedSkillsForm: SkillsForm = {
        skills: [],
        skillsOther: undefined,
      }

      const expectedView = {
        prisonerSummary,
        form: expectedSkillsForm,
        backLinkUrl: '/prisoners/A1234BC/create-induction/check-your-answers',
        backLinkAriaText: `Back to Check and save your answers before adding Jimmy Lightfingers's goals`,
      }

      // When
      await controller.getSkillsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/skills/index', expectedView)
      expect(req.session.personalInterestsForm).toBeUndefined()
      expect(req.session.inductionDto).toEqual(inductionDto)
      expect(req.session.pageFlowHistory).toEqual(expectedPageFlowHistory)
    })
  })

  describe('submitSkillsForm', () => {
    it('should not update Induction given form is submitted with validation errors', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.skills = undefined
      req.session.inductionDto = inductionDto

      const invalidSkillsForm = {
        skills: ['OTHER'],
        skillsOther: '',
      }
      req.body = invalidSkillsForm
      req.session.skillsForm = undefined

      const expectedErrors = [{ href: '#skillsOther', text: 'Enter the skill that Jimmy Lightfingers feels they have' }]

      // When
      await controller.submitSkillsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/skills', expectedErrors)
      expect(req.session.skillsForm).toEqual(invalidSkillsForm)
      expect(req.session.inductionDto).toEqual(inductionDto)
    })

    it('should update inductionDto and redirect to personal interests page', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.skills = undefined
      req.session.inductionDto = inductionDto

      const skillsForm = {
        skills: ['TEAMWORK', 'OTHER'],
        skillsOther: 'Circus skills',
      }
      req.body = skillsForm
      req.session.skillsForm = undefined

      const expectedSkills: Array<PersonalSkillDto> = [
        { skillType: SkillsValue.TEAMWORK, skillTypeOther: undefined },
        { skillType: SkillsValue.OTHER, skillTypeOther: 'Circus skills' },
      ]

      // When
      await controller.submitSkillsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.personalSkillsAndInterests.skills).toEqual(expectedSkills)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/personal-interests')
      expect(req.session.skillsForm).toBeUndefined()
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.skills = undefined
      req.session.inductionDto = inductionDto

      const skillsForm = {
        skills: ['TEAMWORK', 'OTHER'],
        skillsOther: 'Circus skills',
      }
      req.body = skillsForm
      req.session.skillsForm = undefined

      const expectedSkills: Array<PersonalSkillDto> = [
        { skillType: SkillsValue.TEAMWORK, skillTypeOther: undefined },
        { skillType: SkillsValue.OTHER, skillTypeOther: 'Circus skills' },
      ]

      req.session.pageFlowHistory = {
        pageUrls: [
          '/prisoners/A1234BC/create-induction/check-your-answers',
          '/prisoners/A1234BC/create-induction/skills',
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.submitSkillsForm(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.personalSkillsAndInterests.skills).toEqual(expectedSkills)
      expect(res.redirect).toHaveBeenCalledWith('/prisoners/A1234BC/create-induction/check-your-answers')
      expect(req.session.skillsForm).toBeUndefined()
    })
  })
})
