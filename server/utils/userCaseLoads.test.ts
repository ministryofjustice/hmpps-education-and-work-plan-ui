import { includesActiveCaseLoad, isActiveCaseLoad, isInUsersCaseLoad } from './userCaseLoads'
import { User } from '../data/manageUsersApiClient'

describe('userCaseLoads', () => {
  describe('isActiveCaseLoad', () => {
    it('Should return true when the prisonId matches the active case load', () => {
      const user = { authSource: 'nomis', activeCaseLoadId: 'ABC' } as User
      expect(isActiveCaseLoad('ABC', user)).toEqual(true)
    })

    it('Should return false when the prisonId does not match the active case load', () => {
      const user = { authSource: 'nomis', activeCaseLoadId: 'ABC' } as User
      expect(isActiveCaseLoad('DEF', user)).toEqual(false)
    })

    it('Should return false for non prison users', () => {
      const probationUser = { authSource: 'delius' } as User
      const externalUser = { authSource: 'external' } as User

      expect(isActiveCaseLoad('123', probationUser)).toEqual(false)
      expect(isActiveCaseLoad('123', externalUser)).toEqual(false)
    })
  })

  describe('includesActiveCaseLoad', () => {
    it('Should return true when one of the prisonIds matches the active case load', () => {
      const user = { authSource: 'nomis', activeCaseLoadId: 'ABC' } as User
      expect(includesActiveCaseLoad(['ABC', 'DEF'], user)).toEqual(true)
    })

    it('Should return false when non of the prisonIds match the active case load', () => {
      const user = { authSource: 'nomis', activeCaseLoadId: 'ABC' } as User
      expect(includesActiveCaseLoad(['DEF', 'GHI'], user)).toEqual(false)
    })

    it('Should return false for non prison users', () => {
      const probationUser = { authSource: 'delius' } as User
      const externalUser = { authSource: 'external' } as User

      expect(includesActiveCaseLoad(['ABC'], probationUser)).toEqual(false)
      expect(includesActiveCaseLoad(['ABC'], externalUser)).toEqual(false)
    })
  })

  describe('isInUsersCaseLoad', () => {
    it('Should return true when the user has a caseload matching the prisoner', () => {
      const caseLoadIds = ['ABC', 'DEF']
      const user = { authSource: 'nomis', caseLoadIds } as User

      expect(isInUsersCaseLoad('DEF', user)).toEqual(true)
    })

    it('Should return false when the user has a caseload that doesnt match the prisoner', () => {
      const caseLoadIds = ['ABC', 'DEF']
      const user = { authSource: 'nomis', caseLoadIds } as User

      expect(isInUsersCaseLoad('123', user)).toEqual(false)
    })

    it('Should return false for non prison users', () => {
      const probationUser = { authSource: 'delius' } as User
      const externalUser = { authSource: 'external' } as User

      expect(isInUsersCaseLoad('123', probationUser)).toEqual(false)
      expect(isInUsersCaseLoad('123', externalUser)).toEqual(false)
    })
  })
})
