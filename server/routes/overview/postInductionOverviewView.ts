import type { ActionPlan, FunctionalSkills, InPrisonCourseRecords, PrisonerSummary } from 'viewModels'

export default class PostInductionOverviewView {
  constructor(
    private readonly prisonNumber: string,
    private readonly prisonerSummary: PrisonerSummary,
    private readonly actionPlan: ActionPlan,
    private readonly functionalSkills: FunctionalSkills,
    private readonly inPrisonCourses: InPrisonCourseRecords,
    private readonly showGoalCreationSuccessMessage: boolean,
  ) {}

  get renderArgs(): {
    prisonNumber: string
    tab: string
    prisonerSummary: PrisonerSummary
    actionPlan: ActionPlan
    functionalSkills: FunctionalSkills
    inPrisonCourses: InPrisonCourseRecords
    isPostInduction: boolean
    showGoalCreationSuccessMessage: boolean
  } {
    return {
      prisonNumber: this.prisonNumber,
      tab: 'overview',
      prisonerSummary: this.prisonerSummary,
      actionPlan: this.actionPlan,
      functionalSkills: this.functionalSkills,
      inPrisonCourses: this.inPrisonCourses,
      isPostInduction: true,
      showGoalCreationSuccessMessage: this.showGoalCreationSuccessMessage,
    }
  }
}
