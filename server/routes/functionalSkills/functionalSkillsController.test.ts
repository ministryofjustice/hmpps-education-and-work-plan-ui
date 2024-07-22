import { NextFunction, Request, Response } from 'express'
import { SessionData } from 'express-session'
import moment from 'moment'
import type { Assessment } from 'viewModels'
import CuriousService from '../../services/curiousService'
import PrisonService from '../../services/prisonService'
import FunctionalSkillsController from './functionalSkillsController'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import {
  functionalSkillsWithProblemRetrievingData,
  validFunctionalSkills,
  validFunctionalSkillsWithNoAssessments,
} from '../../testsupport/functionalSkillsTestDataBuilder'

jest.mock('../../services/curiousService')
jest.mock('../../services/prisonService')

describe('functionalSkillsController', () => {
  const curiousService = new CuriousService(null, null, null) as jest.Mocked<CuriousService>
  const prisonService = new PrisonService(null, null, null) as jest.Mocked<PrisonService>
  const controller = new FunctionalSkillsController(curiousService, prisonService)

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

  const mockAllPrisonNaneLookup = (): Promise<Map<string, string>> => {
    const prisonNamesById = new Map([
      ['MDI', 'Moorland (HMP & YOI)'],
      ['LFI', 'Lancaster Farms (HMP)'],
      ['WMI', 'Wymott (HMP & YOI)'],
    ])
    return Promise.resolve(prisonNamesById)
  }

  describe('getFunctionalSkillsView', () => {
    it('should get functional skills view given curious service returns functional skills data for the prisoner', async () => {
      // Given
      const prisonNumber = 'A1234GC'
      req.params = { prisonNumber }

      const prisonerSummary = aValidPrisonerSummary(prisonNumber)
      req.session.prisonerSummary = prisonerSummary

      prisonService.getAllPrisonNamesById.mockImplementation(mockAllPrisonNaneLookup)

      const functionalSkills = validFunctionalSkills({
        prisonNumber,
        assessments: [
          {
            type: 'ENGLISH',
            grade: 'Level 1',
            assessmentDate: TEN_DAYS_AGO,
            prisonId: 'MDI',
            prisonName: 'MOORLAND (HMP/YOI)',
          },
          {
            type: 'MATHS',
            grade: 'Level 1',
            assessmentDate: TEN_DAYS_AGO,
            prisonId: 'MDI',
            prisonName: 'MOORLAND (HMP/YOI)',
          },
          {
            type: 'DIGITAL_LITERACY',
            grade: 'Level 1',
            assessmentDate: TEN_DAYS_AGO,
            prisonId: 'MDI',
            prisonName: 'MOORLAND (HMP/YOI)',
          },
          {
            type: 'DIGITAL_LITERACY',
            grade: 'Level 3',
            assessmentDate: YESTERDAY,
            prisonId: 'MDI',
            prisonName: 'MOORLAND (HMP/YOI)',
          },
          {
            type: 'MATHS',
            grade: 'Level 2',
            assessmentDate: FIVE_DAYS_AGO,
            prisonId: 'LFI',
            prisonName: 'LANCASTER FARMS (HMP)',
          },
          {
            type: 'DIGITAL_LITERACY',
            grade: 'Level 2',
            assessmentDate: FIVE_DAYS_AGO,
            prisonId: 'LEI',
            prisonName: 'LEEDS (HMP)',
          },
          {
            type: 'MATHS',
            grade: 'Level 3',
            assessmentDate: YESTERDAY,
            prisonId: 'WMI',
            prisonName: 'WYMOTT (HMP/YOI)',
          },
        ],
      })
      curiousService.getPrisonerFunctionalSkills.mockResolvedValue(functionalSkills)

      const expectedDigitalSkills: Array<Assessment> = [
        {
          type: 'DIGITAL_LITERACY',
          grade: 'Level 3',
          assessmentDate: YESTERDAY,
          prisonId: 'MDI',
          prisonName: 'Moorland (HMP & YOI)',
        },
        {
          type: 'DIGITAL_LITERACY',
          grade: 'Level 2',
          assessmentDate: FIVE_DAYS_AGO,
          prisonId: 'LEI',
          prisonName: undefined,
        },
        {
          type: 'DIGITAL_LITERACY',
          grade: 'Level 1',
          assessmentDate: TEN_DAYS_AGO,
          prisonId: 'MDI',
          prisonName: 'Moorland (HMP & YOI)',
        },
      ]

      const expectedEnglishSkills = [
        {
          type: 'ENGLISH',
          grade: 'Level 1',
          assessmentDate: TEN_DAYS_AGO,
          prisonId: 'MDI',
          prisonName: 'Moorland (HMP & YOI)',
        },
      ] as Array<Assessment>

      const expectedMathsSkills = [
        {
          type: 'MATHS',
          grade: 'Level 3',
          assessmentDate: YESTERDAY,
          prisonId: 'WMI',
          prisonName: 'Wymott (HMP & YOI)',
        },
        {
          type: 'MATHS',
          grade: 'Level 2',
          assessmentDate: FIVE_DAYS_AGO,
          prisonId: 'LFI',
          prisonName: 'Lancaster Farms (HMP)',
        },
        {
          type: 'MATHS',
          grade: 'Level 1',
          assessmentDate: TEN_DAYS_AGO,
          prisonId: 'MDI',
          prisonName: 'Moorland (HMP & YOI)',
        },
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

      const functionalSkills = validFunctionalSkillsWithNoAssessments({ prisonNumber })
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
      expect(prisonService.getAllPrisonNamesById).not.toHaveBeenCalled()
    })

    it('should get functional skills view given curious service has problem retrieving data', async () => {
      // Given
      const prisonNumber = 'A1234GC'
      req.params = { prisonNumber }

      const prisonerSummary = aValidPrisonerSummary(prisonNumber)
      req.session.prisonerSummary = prisonerSummary

      const functionalSkills = functionalSkillsWithProblemRetrievingData({ prisonNumber })
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
      expect(prisonService.getAllPrisonNamesById).not.toHaveBeenCalled()
    })
  })
})
