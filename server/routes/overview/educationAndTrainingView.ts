import type { FunctionalSkills, InductionSchedule, InPrisonCourseRecords, PrisonerSummary } from 'viewModels'
import type { EducationDto } from 'dto'
import type { InductionDto } from 'inductionDto'
import { InductionScheduleView } from './overviewViewTypes'
import { toInductionScheduleView } from './overviewViewFunctions'

export default class EducationAndTrainingView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly functionalSkills: FunctionalSkills,
    private readonly inPrisonCourses: InPrisonCourseRecords,
    private readonly induction: {
      problemRetrievingData: boolean
      inductionDto?: InductionDto
    },
    private readonly education: {
      problemRetrievingData: boolean
      educationDto?: EducationDto
    },
    private readonly inductionSchedule: InductionSchedule,
  ) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    functionalSkills: FunctionalSkills
    inPrisonCourses: InPrisonCourseRecords
    induction: {
      problemRetrievingData: boolean
      inductionDto?: InductionDto
    }
    education: {
      problemRetrievingData: boolean
      educationDto?: EducationDto
    }
    inductionSchedule: InductionScheduleView
  } {
    return {
      tab: 'education-and-training',
      prisonerSummary: this.prisonerSummary,
      functionalSkills: this.functionalSkills,
      inPrisonCourses: this.inPrisonCourses,
      induction: this.induction,
      education: this.education,
      inductionSchedule: toInductionScheduleView(this.inductionSchedule, this.induction.inductionDto),
    }
  }
}
