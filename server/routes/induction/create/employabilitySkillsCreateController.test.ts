import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import EmployabilitySkillsCreateController from './employabilitySkillsCreateController'
import { aValidInductionDto } from '../../../testsupport/inductionDtoTestDataBuilder'
import EmployabilitySkillsValue from '../../../enums/employabilitySkillsValue'
import { anEmployabilitySkillResponseDto } from '../../../testsupport/employabilitySkillResponseDtoTestDataBuilder'
import EmployabilitySkillRatingValue from '../../../enums/employabilitySkillRatingValue'
import EmployabilitySkillSessionType from '../../../enums/employabilitySkillSessionType'

describe('employabilitySkillsCreateController', () => {
  const controller = new EmployabilitySkillsCreateController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const flash = jest.fn()
  const req = {
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber },
    flash,
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

  describe('getEmployabilitySkillsView', () => {
    it('should get the Employability Skills view given there is no EmployabilitySkillsForm on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto({
        employabilitySkills: null,
      })
      req.journeyData.inductionDto = inductionDto
      res.locals.invalidForm = undefined

      const expectedEmployabilitySkillsForm = {
        employabilitySkills: [] as Array<EmployabilitySkillsValue>,
        rating: {},
      }

      const expectedView = {
        prisonerSummary,
        form: expectedEmployabilitySkillsForm,
      }

      // When
      await controller.getEmployabilitySkillsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/employability-skills/index', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the Employability Skills view given there is are Employability Skills on the Induction', async () => {
      // Given
      const inductionDto = aValidInductionDto({
        employabilitySkills: [
          anEmployabilitySkillResponseDto({
            employabilitySkillType: EmployabilitySkillsValue.CREATIVITY,
            employabilitySkillRating: EmployabilitySkillRatingValue.VERY_CONFIDENT,
          }),
          anEmployabilitySkillResponseDto({
            employabilitySkillType: EmployabilitySkillsValue.PLANNING,
            employabilitySkillRating: EmployabilitySkillRatingValue.NOT_CONFIDENT,
          }),
        ],
      })
      req.journeyData.inductionDto = inductionDto

      const expectedEmployabilitySkillsForm = {
        employabilitySkills: ['CREATIVITY', 'PLANNING'],
        rating: {
          CREATIVITY: 'VERY_CONFIDENT',
          PLANNING: 'NOT_CONFIDENT',
        },
      }

      const expectedView = {
        prisonerSummary,
        form: expectedEmployabilitySkillsForm,
      }

      // When
      await controller.getEmployabilitySkillsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/employability-skills/index', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })

    it('should get the Employability Skills view given there is an EmployabilitySkillsForm already on res.locals.invalidForm', async () => {
      // Given
      const inductionDto = aValidInductionDto({
        employabilitySkills: null,
      })
      req.journeyData.inductionDto = inductionDto

      const expectedEmployabilitySkillsForm = {
        employabilitySkills: ['TIMEKEEPING'],
        rating: {},
      }
      res.locals.invalidForm = expectedEmployabilitySkillsForm

      const expectedView = {
        prisonerSummary,
        form: expectedEmployabilitySkillsForm,
      }

      // When
      await controller.getEmployabilitySkillsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/induction/employability-skills/index', expectedView)
      expect(req.journeyData.inductionDto).toEqual(inductionDto)
    })
  })

  describe('submitEmployabilitySkillsForm', () => {
    it('should update inductionDto and redirect to personal interests page given previous page was not Check Your Answers', async () => {
      // Given
      req.query = {}

      const inductionDto = aValidInductionDto({
        employabilitySkills: null,
      })
      req.journeyData.inductionDto = inductionDto

      const employabilitySkillsForm = {
        employabilitySkills: ['TIMEKEEPING'],
        rating: {
          TIMEKEEPING: 'VERY_CONFIDENT',
        },
      }
      req.body = employabilitySkillsForm

      const expectedEmployabilitySkills = [
        {
          employabilitySkillType: EmployabilitySkillsValue.TIMEKEEPING,
          employabilitySkillRating: EmployabilitySkillRatingValue.VERY_CONFIDENT,
          sessionType: EmployabilitySkillSessionType.CIAG_INDUCTION,
          evidence: 'Session Type does not require evidence',
        },
      ]

      // When
      await controller.submitEmployabilitySkillsForm(req, res, next)

      // Then
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.employabilitySkills).toEqual(expectedEmployabilitySkills)
      expect(res.redirect).toHaveBeenCalledWith('personal-interests')
    })

    it('should update inductionDto and redirect to Check Your Answers given previous page was Check Your Answers', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }

      const inductionDto = aValidInductionDto({
        employabilitySkills: null,
      })
      req.journeyData.inductionDto = inductionDto

      const employabilitySkillsForm = {
        employabilitySkills: ['TIMEKEEPING', 'COMMUNICATION'],
        rating: {
          COMMUNICATION: 'NOT_CONFIDENT',
          TIMEKEEPING: 'VERY_CONFIDENT',
        },
      }
      req.body = employabilitySkillsForm

      const expectedEmployabilitySkills = [
        {
          employabilitySkillType: EmployabilitySkillsValue.TIMEKEEPING,
          employabilitySkillRating: EmployabilitySkillRatingValue.VERY_CONFIDENT,
          sessionType: EmployabilitySkillSessionType.CIAG_INDUCTION,
          evidence: 'Session Type does not require evidence',
        },
        {
          employabilitySkillType: EmployabilitySkillsValue.COMMUNICATION,
          employabilitySkillRating: EmployabilitySkillRatingValue.NOT_CONFIDENT,
          sessionType: EmployabilitySkillSessionType.CIAG_INDUCTION,
          evidence: 'Session Type does not require evidence',
        },
      ]

      // When
      await controller.submitEmployabilitySkillsForm(req, res, next)

      // Then
      const updatedInduction = req.journeyData.inductionDto
      expect(updatedInduction.employabilitySkills).toEqual(expectedEmployabilitySkills)
      expect(res.redirect).toHaveBeenCalledWith('check-your-answers')
    })
  })
})
