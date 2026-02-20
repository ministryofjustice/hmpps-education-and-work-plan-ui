/**
 * Module containing utility functions to do with user caseloads
 */
import { HmppsUser } from '../interfaces/hmppsUser'

export function isInUsersCaseLoad(prisonId: string, user: HmppsUser): boolean {
  return user.authSource === 'nomis' && user.caseLoadIds.some(caseLoadId => caseLoadId === prisonId)
}

export function isActiveCaseLoad(prisonId: string, user: HmppsUser): boolean {
  return user.authSource === 'nomis' && user.activeCaseLoadId === prisonId
}

export function includesActiveCaseLoad(prisons: string[], user: HmppsUser) {
  return user.authSource === 'nomis' && prisons.includes(user.activeCaseLoadId)
}
