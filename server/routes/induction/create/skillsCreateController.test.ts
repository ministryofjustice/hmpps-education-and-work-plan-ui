import { NextFunction, Request, Response } from 'express'
import type { SessionData } from 'express-session'
import type { SkillsForm } from 'inductionForms'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aLongQuestionSetInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import SkillsCreateController from './skillsCreateController'

describe('skillsCreateController', () => {
  const controller = new SkillsCreateController()

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
    req.user = {} as Express.User
    req.params = { prisonNumber }
    req.path = `/prisoners/${prisonNumber}/create-induction/skills`
  })

  describe('getSkillsView', () => {
    it('should get the Skills view given there is no SkillsForm on the session', async () => {
      // Given
      const inductionDto = aLongQuestionSetInductionDto()
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
        backLinkUrl: '/prisoners/A1234BC/create-induction/work-interest-roles',
        backLinkAriaText: 'Back to Is Jimmy Lightfingers interested in any particular jobs?',
        errors: noErrors,
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
      const inductionDto = aLongQuestionSetInductionDto()
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
        backLinkUrl: '/prisoners/A1234BC/create-induction/work-interest-roles',
        backLinkAriaText: 'Back to Is Jimmy Lightfingers interested in any particular jobs?',
        errors: noErrors,
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
  })
})
