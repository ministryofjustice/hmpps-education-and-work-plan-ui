/**
 * Module containing utility functions to do with user caseloads
 */
import { User } from '../data/manageUsersApiClient'

export function isInUsersCaseLoad(prisonId: string, user: User): boolean {
  return user.authSource === 'nomis' && user.caseLoadIds.some(caseLoadId => caseLoadId === prisonId)
}

export function isActiveCaseLoad(prisonId: string, user: User): boolean {
  return user.authSource === 'nomis' && user.activeCaseLoadId === prisonId
}

export function includesActiveCaseLoad(prisons: string[], user: User) {
  return user.authSource === 'nomis' && prisons.includes(user.activeCaseLoadId)
}
