import type { SessionsSummary } from 'viewModels'

const aValidSessionsSummary = (options?: {
  overdueSessionCount?: number
  dueSessionCount?: number
  onHoldSessionCount?: number
}): SessionsSummary => ({
  overdueSessionCount: options?.overdueSessionCount || 19,
  dueSessionCount: options?.dueSessionCount || 107,
  onHoldSessionCount: options?.onHoldSessionCount || 6,
})

export default aValidSessionsSummary
