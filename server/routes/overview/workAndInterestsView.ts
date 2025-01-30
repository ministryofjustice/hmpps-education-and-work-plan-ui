import type { InductionSchedule, PrisonerSummary } from 'viewModels'
import type { InductionDto } from 'inductionDto'
import { InductionScheduleView } from './overviewViewTypes'
import { toInductionScheduleView } from './overviewViewFunctions'

export default class WorkAndInterestsView {
  constructor(
    private readonly prisonerSummary: PrisonerSummary,
    private readonly induction: {
      problemRetrievingData: boolean
      inductionDto?: InductionDto
    },
    private readonly inductionSchedule: InductionSchedule,
  ) {}

  get renderArgs(): {
    tab: string
    prisonerSummary: PrisonerSummary
    induction: {
      problemRetrievingData: boolean
      inductionDto?: InductionDto
    }
    inductionSchedule: InductionScheduleView
  } {
    return {
      tab: 'work-and-interests',
      prisonerSummary: this.prisonerSummary,
      induction: this.induction,
      inductionSchedule: toInductionScheduleView(this.inductionSchedule, this.induction.inductionDto),
    }
  }
}
