import SearchPlanStatus from '../enums/searchPlanStatus'

const searchPlanStatusScreenValues: Record<SearchPlanStatus, string> = {
  PENDING_SCREENING_AND_ASSESSMENTS: 'Screener pending',
  ACTIVE_PLAN: 'Plan created',
  NEEDS_PLAN: 'Needs plan',
  EXEMPT: 'Exempt',
}

const formatSearchPlanStatusFilter = (value: SearchPlanStatus): string => searchPlanStatusScreenValues[value]

export default formatSearchPlanStatusFilter
