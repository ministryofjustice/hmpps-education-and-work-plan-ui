import type { FunctionalSkills, GoalsOrProblem, InPrisonCourseRecords, PrisonerSummary } from 'viewModels'

export default class PreInductionOverviewView {
  constructor(
    private readonly prisonNumber: string,
    private readonly prisonerSummary: PrisonerSummary,
    private readonly goalsOrProblem: GoalsOrProblem,
    private readonly functionalSkills: FunctionalSkills,
    private readonly inPrisonCourses: InPrisonCourseRecords,
  ) {}

  get renderArgs(): {
    prisonNumber: string
    tab: string
    prisonerSummary: PrisonerSummary
    goalsOrProblem: GoalsOrProblem
    functionalSkills: FunctionalSkills
    inPrisonCourses: InPrisonCourseRecords
    isPostInduction: boolean
  } {
    return {
      prisonNumber: this.prisonNumber,
      tab: 'overview',
      prisonerSummary: this.prisonerSummary,
      goalsOrProblem: this.goalsOrProblem,
      functionalSkills: this.functionalSkills,
      inPrisonCourses: this.inPrisonCourses,
      isPostInduction: false,
    }
  }
}
