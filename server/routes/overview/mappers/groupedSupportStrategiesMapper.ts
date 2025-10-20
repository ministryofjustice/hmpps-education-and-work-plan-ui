import type { SupportStrategyResponseDto } from 'dto'
import { compareDesc } from 'date-fns'
import { Result } from '../../../utils/result/result'
import SupportStrategyType from '../../../enums/supportStrategyType'

type GroupedSupportStrategies = {
  [key: string]: SupportStrategyResponseDto[]
}

const toGroupedSupportStrategiesPromise = (
  supportStrategies: Result<Array<SupportStrategyResponseDto>>,
): Result<GroupedSupportStrategies, Error> => {
  if (supportStrategies.isFulfilled()) {
    return Result.fulfilled(groupSupportStrategiesByCategory(supportStrategies.getOrNull()))
  }

  return Result.rewrapRejected(supportStrategies)
}

const groupSupportStrategiesByCategory = (strategies: SupportStrategyResponseDto[]): GroupedSupportStrategies => {
  const sortedByDate = [...strategies].sort((a, b) => compareDesc(a.updatedAt, b.updatedAt))

  const sortedByDateAndGrouped = sortedByDate.reduce((grouped, strategy) => {
    const category = strategy.supportStrategyTypeCode
    return {
      ...grouped,
      [category]: [...(grouped[category] || []), strategy],
    }
  }, {} as GroupedSupportStrategies)
  const sortedByDateAndGroupAsc = Object.entries(sortedByDateAndGrouped).sort(([categoryA], [categoryB]) => {
    if (categoryA === SupportStrategyType.GENERAL) return 1
    if (categoryB === SupportStrategyType.GENERAL) return -1
    return categoryA.localeCompare(categoryB)
  })
  return Object.fromEntries(sortedByDateAndGroupAsc)
}

export default toGroupedSupportStrategiesPromise
