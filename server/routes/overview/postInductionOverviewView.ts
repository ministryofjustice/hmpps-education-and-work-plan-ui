import type { FunctionalSkills, Goals, InPrisonCourseRecords, PrisonerSummary } from 'viewModels'

export default class PostInductionOverviewView {
  constructor(
    private readonly prisonNumber: string,
    private readonly prisonerSummary: PrisonerSummary,
    private readonly goals: Goals,
    private readonly functionalSkills: FunctionalSkills,
    private readonly inPrisonCourses: InPrisonCourseRecords,
  ) {}

  get renderArgs(): {
    prisonNumber: string
    tab: string
    prisonerSummary: PrisonerSummary
    goals: Goals
    functionalSkills: FunctionalSkills
    inPrisonCourses: InPrisonCourseRecords
    isPostInduction: boolean
  } {
    return {
      prisonNumber: this.prisonNumber,
      tab: 'overview',
      prisonerSummary: this.prisonerSummary,
      goals: this.goals,
      functionalSkills: this.functionalSkills,
      inPrisonCourses: this.inPrisonCourses,
      isPostInduction: true,
    }
  }
}
