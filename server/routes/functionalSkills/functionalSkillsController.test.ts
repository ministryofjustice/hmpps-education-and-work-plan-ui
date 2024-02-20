import { NextFunction, Request, Response } from 'express'
import { SessionData } from 'express-session'
import moment from 'moment'
import type { Assessment, FunctionalSkills } from 'viewModels'
import { CuriousService, PrisonService } from '../../services'
import FunctionalSkillsController from './functionalSkillsController'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'

describe('functionalSkillsController', () => {
  const curiousService = {
    getPrisonerFunctionalSkills: jest.fn(),
  }

  const prisonService = {
    lookupPrison: jest.fn(),
  }

  const controller = new FunctionalSkillsController(
    curiousService as unknown as CuriousService,
    prisonService as unknown as PrisonService,
  )

  const req = {
    session: {} as SessionData,
    params: {},
    user: {} as Express.User,
  }
  const res = {
    render: jest.fn(),
  }
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.params = {}
    req.session = {} as SessionData
    req.user.token = 'some-token'
    req.user.username = 'AUSER_GEN'
  })

  const NOW = moment()
  const YESTERDAY = moment(NOW).subtract(1, 'days').toDate()
  const FIVE_DAYS_AGO = moment(NOW).subtract(5, 'days').toDate()
  const TEN_DAYS_AGO = moment(NOW).subtract(10, 'days').toDate()

  describe('getFunctionalSkillsView', () => {
    it('should get functional skills view given curious service returns functional skills data for the prisoner', async () => {
      // Given
      const prisonNumber = 'A1234GC'
      req.params = { prisonNumber }

      const prisonerSummary = aValidPrisonerSummary(prisonNumber)
      req.session.prisonerSummary = prisonerSummary

      const functionalSkills = {
        problemRetrievingData: false,
        assessments: [
          { type: 'ENGLISH', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
          { type: 'MATHS', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
          { type: 'DIGITAL_LITERACY', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
          { type: 'DIGITAL_LITERACY', grade: 'Level 3', assessmentDate: YESTERDAY },
          { type: 'MATHS', grade: 'Level 2', assessmentDate: FIVE_DAYS_AGO },
          { type: 'DIGITAL_LITERACY', grade: 'Level 2', assessmentDate: FIVE_DAYS_AGO },
          { type: 'MATHS', grade: 'Level 3', assessmentDate: YESTERDAY },
        ],
      } as FunctionalSkills
      curiousService.getPrisonerFunctionalSkills.mockResolvedValue(functionalSkills)

      const expectedDigitalSkills = [
        { type: 'DIGITAL_LITERACY', grade: 'Level 3', assessmentDate: YESTERDAY },
        { type: 'DIGITAL_LITERACY', grade: 'Level 2', assessmentDate: FIVE_DAYS_AGO },
        { type: 'DIGITAL_LITERACY', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
      ] as Array<Assessment>

      const expectedEnglishSkills = [
        { type: 'ENGLISH', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
      ] as Array<Assessment>

      const expectedMathsSkills = [
        { type: 'MATHS', grade: 'Level 3', assessmentDate: YESTERDAY },
        { type: 'MATHS', grade: 'Level 2', assessmentDate: FIVE_DAYS_AGO },
        { type: 'MATHS', grade: 'Level 1', assessmentDate: TEN_DAYS_AGO },
      ] as Array<Assessment>

      const expectedView = {
        prisonerSummary,
        problemRetrievingData: false,
        digitalSkills: expectedDigitalSkills,
        englishSkills: expectedEnglishSkills,
        mathsSkills: expectedMathsSkills,
      }

      // When
      await controller.getFunctionalSkillsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/functionalSkills/index', expectedView)
      expect(curiousService.getPrisonerFunctionalSkills).toHaveBeenCalledWith(prisonNumber, 'AUSER_GEN')
    })

    it('should get functional skills view given curious service returns no functional skills data for the prisoner', async () => {
      // Given
      const prisonNumber = 'A1234GC'
      req.params = { prisonNumber }

      const prisonerSummary = aValidPrisonerSummary(prisonNumber)
      req.session.prisonerSummary = prisonerSummary

      const functionalSkills = {
        problemRetrievingData: false,
        assessments: [],
      } as FunctionalSkills
      curiousService.getPrisonerFunctionalSkills.mockResolvedValue(functionalSkills)

      const expectedDigitalSkills = [] as Array<Assessment>

      const expectedEnglishSkills = [] as Array<Assessment>

      const expectedMathsSkills = [] as Array<Assessment>

      const expectedView = {
        prisonerSummary,
        problemRetrievingData: false,
        digitalSkills: expectedDigitalSkills,
        englishSkills: expectedEnglishSkills,
        mathsSkills: expectedMathsSkills,
      }

      // When
      await controller.getFunctionalSkillsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/functionalSkills/index', expectedView)
      expect(curiousService.getPrisonerFunctionalSkills).toHaveBeenCalledWith(prisonNumber, 'AUSER_GEN')
    })

    it('should get functional skills view given curious service has problem retrieving data', async () => {
      // Given
      const prisonNumber = 'A1234GC'
      req.params = { prisonNumber }

      const prisonerSummary = aValidPrisonerSummary(prisonNumber)
      req.session.prisonerSummary = prisonerSummary

      const functionalSkills = {
        problemRetrievingData: true,
      } as FunctionalSkills
      curiousService.getPrisonerFunctionalSkills.mockResolvedValue(functionalSkills)

      const expectedDigitalSkills = [] as Array<Assessment>

      const expectedEnglishSkills = [] as Array<Assessment>

      const expectedMathsSkills = [] as Array<Assessment>

      const expectedView = {
        prisonerSummary,
        problemRetrievingData: true,
        digitalSkills: expectedDigitalSkills,
        englishSkills: expectedEnglishSkills,
        mathsSkills: expectedMathsSkills,
      }

      // When
      await controller.getFunctionalSkillsView(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/functionalSkills/index', expectedView)
      expect(curiousService.getPrisonerFunctionalSkills).toHaveBeenCalledWith(prisonNumber, 'AUSER_GEN')
    })
  })
})
