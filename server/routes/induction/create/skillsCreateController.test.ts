import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import type { SkillsForm } from 'inductionForms'
import type { PersonalSkillDto } from 'inductionDto'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import SkillsCreateController from './skillsCreateController'
import SkillsValue from '../../../enums/skillsValue'

describe('skillsCreateController', () => {
  const controller = new SkillsCreateController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    body: {},
    params: { prisonNumber, journeyId },
    originalUrl: `/prisoners/${prisonNumber}/create-induction/${journeyId}/skills`,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.session.pageFlowHistory = undefined
    req.body = {}
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
      }

      // When
      await controller.getSkillsView(req, res, next)

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
      }

      // When
      await controller.getSkillsView(req, res, next)

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
        pageUrls: [`/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`],
        currentPageIndex: 0,
      }

      const expectedPageFlowHistory = {
        pageUrls: [
          `/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`,
          `/prisoners/A1234BC/create-induction/${journeyId}/skills`,
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
      }

      // When
      await controller.getSkillsView(req, res, next)

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
      await controller.submitSkillsForm(req, res, next)

      // Then
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        `/prisoners/A1234BC/create-induction/${journeyId}/skills`,
        expectedErrors,
      )
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
      await controller.submitSkillsForm(req, res, next)

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.personalSkillsAndInterests.skills).toEqual(expectedSkills)
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/personal-interests`)
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
          `/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`,
          `/prisoners/A1234BC/create-induction/${journeyId}/skills`,
        ],
        currentPageIndex: 1,
      }

      // When
      await controller.submitSkillsForm(req, res, next)

      // Then
      const updatedInduction = req.session.inductionDto
      expect(updatedInduction.personalSkillsAndInterests.skills).toEqual(expectedSkills)
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`)
      expect(req.session.skillsForm).toBeUndefined()
    })
  })
})
