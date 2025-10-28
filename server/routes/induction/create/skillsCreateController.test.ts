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
    journeyData: {},
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
    req.body = {}
    req.journeyData = {}
    req.query = {}
    res.locals.invalidForm = undefined
  })

  describe('getSkillsView', () => {
    it('should get the Skills view given there is no SkillsForm on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.skills = undefined
      req.journeyData.inductionDto = inductionDto
      res.locals.invalidForm = undefined

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
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the Skills view given there is an SkillsForm already on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.skills = undefined
      req.journeyData.inductionDto = inductionDto

      const expectedSkillsForm = {
        skills: ['SELF_MANAGEMENT', 'TEAMWORK', 'THINKING_AND_PROBLEM_SOLVING'],
        skillsOther: '',
      }
      res.locals.invalidForm = expectedSkillsForm

      const expectedView = {
        prisonerSummary,
        form: expectedSkillsForm,
      }

      // When
      await controller.getSkillsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/skills/index', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitSkillsForm', () => {
    it('should update inductionDto and redirect to personal interests page given previous page was not Check Your Answers', async () => {
      // Given
      req.query = {}

      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.skills = undefined
      req.journeyData.inductionDto = inductionDto

      const skillsForm = {
        skills: ['TEAMWORK', 'OTHER'],
        skillsOther: 'Circus skills',
      }
      req.body = skillsForm

      const expectedSkills: Array<PersonalSkillDto> = [
        { skillType: SkillsValue.TEAMWORK, skillTypeOther: undefined },
        { skillType: SkillsValue.OTHER, skillTypeOther: 'Circus skills' },
      ]

      // When
      await controller.submitSkillsForm(req, res, next)

      // Then
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.personalSkillsAndInterests.skills).toEqual(expectedSkills)
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/personal-interests`)
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }

      const inductionDto = aValidInductionDto()
      inductionDto.personalSkillsAndInterests.skills = undefined
      req.journeyData.inductionDto = inductionDto

      const skillsForm = {
        skills: ['TEAMWORK', 'OTHER'],
        skillsOther: 'Circus skills',
      }
      req.body = skillsForm

      const expectedSkills: Array<PersonalSkillDto> = [
        { skillType: SkillsValue.TEAMWORK, skillTypeOther: undefined },
        { skillType: SkillsValue.OTHER, skillTypeOther: 'Circus skills' },
      ]

      // When
      await controller.submitSkillsForm(req, res, next)

      // Then
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.personalSkillsAndInterests.skills).toEqual(expectedSkills)
      expect(res.redirect).toHaveBeenCalledWith(`/prisoners/A1234BC/create-induction/${journeyId}/check-your-answers`)
    })
  })
})
