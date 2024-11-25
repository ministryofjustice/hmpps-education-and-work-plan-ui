import { Request, Response } from 'express'
import { subDays } from 'date-fns'
import type { Assessment } from 'viewModels'
import PrisonService from '../../services/prisonService'
import FunctionalSkillsController from './functionalSkillsController'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import {
  functionalSkillsWithProblemRetrievingData,
  validFunctionalSkills,
  validFunctionalSkillsWithNoAssessments,
} from '../../testsupport/functionalSkillsTestDataBuilder'

jest.mock('../../services/prisonService')

describe('functionalSkillsController', () => {
  const prisonService = new PrisonService(null, null, null) as jest.Mocked<PrisonService>
  const controller = new FunctionalSkillsController(prisonService)

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary(prisonNumber)

  const req = {
    params: { prisonNumber },
    user: { username: 'AUSER_GEN', token: 'some-token' } as Express.User,
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  const NOW = new Date()
  const YESTERDAY = subDays(NOW, 1)
  const FIVE_DAYS_AGO = subDays(NOW, 5)
  const TEN_DAYS_AGO = subDays(NOW, 10)

  const mockAllPrisonNameLookup = (): Promise<Map<string, string>> => {
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
      prisonService.getAllPrisonNamesById.mockImplementation(mockAllPrisonNameLookup)

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
      res.locals.prisonerFunctionalSkills = functionalSkills

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
      await controller.getFunctionalSkillsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/functionalSkills/index', expectedView)
    })

    it('should get functional skills view given curious service returns no functional skills data for the prisoner', async () => {
      // Given
      const functionalSkills = validFunctionalSkillsWithNoAssessments({ prisonNumber })
      res.locals.prisonerFunctionalSkills = functionalSkills

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
      await controller.getFunctionalSkillsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/functionalSkills/index', expectedView)
      expect(prisonService.getAllPrisonNamesById).not.toHaveBeenCalled()
    })

    it('should get functional skills view given curious service has problem retrieving data', async () => {
      // Given
      const functionalSkills = functionalSkillsWithProblemRetrievingData({ prisonNumber })
      res.locals.prisonerFunctionalSkills = functionalSkills

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
      await controller.getFunctionalSkillsView(req, res, next)

      // Then
      expect(res.render).toHaveBeenCalledWith('pages/functionalSkills/index', expectedView)
      expect(prisonService.getAllPrisonNamesById).not.toHaveBeenCalled()
    })
  })
})
