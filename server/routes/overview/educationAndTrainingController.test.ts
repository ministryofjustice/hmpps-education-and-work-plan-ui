import { Request, Response } from 'express'
import { startOfDay } from 'date-fns'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import EducationAndTrainingController from './educationAndTrainingController'
import { aValidInductionDto } from '../../testsupport/inductionDtoTestDataBuilder'
import aValidEducationDto from '../../testsupport/educationDtoTestDataBuilder'
import aValidInductionSchedule from '../../testsupport/inductionScheduleTestDataBuilder'
import InductionScheduleStatusValue from '../../enums/inductionScheduleStatusValue'
import { Result } from '../../utils/result/result'
import validFunctionalSkills from '../../testsupport/functionalSkillsTestDataBuilder'
import validInPrisonCourseRecords from '../../testsupport/inPrisonCourseRecordsTestDataBuilder'

describe('educationAndTrainingController', () => {
  const controller = new EducationAndTrainingController()

  const prisonNumber = 'A1234GC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const induction = {
    problemRetrievingData: false,
    inductionDto: aValidInductionDto(),
  }

  const inPrisonCourses = validInPrisonCourseRecords()
  const prisonerFunctionalSkills = Result.fulfilled(validFunctionalSkills())
  const educationDto = aValidEducationDto()
  const inductionSchedule = aValidInductionSchedule({ scheduleStatus: InductionScheduleStatusValue.COMPLETED })
  const prisonNamesById = Result.fulfilled({ MDI: 'Moorland (HMP & YOI)', WDI: 'Wakefield (HMP)' })

  const expectedTab = 'education-and-training'

  const req = {
    user: {
      username: 'a-dps-user',
    },
    params: {
      prisonNumber,
      tab: expectedTab,
    },
  } as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {
      prisonerSummary,
      curiousInPrisonCourses: inPrisonCourses,
      prisonerFunctionalSkills,
      education: educationDto,
      induction,
      inductionSchedule,
      prisonNamesById,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should get eduction and training view', async () => {
    // Given
    const expectedView = {
      prisonerSummary,
      tab: expectedTab,
      prisonerFunctionalSkills,
      inPrisonCourses,
      induction,
      education: educationDto,
      inductionSchedule: {
        problemRetrievingData: false,
        inductionStatus: 'COMPLETE',
        inductionDueDate: startOfDay('2024-12-10'),
      },
      prisonNamesById,
    }

    // When
    await controller.getEducationAndTrainingView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith('pages/overview/index', expectedView)
  })
})
