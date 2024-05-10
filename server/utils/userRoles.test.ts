import { userHasRoles, userHasAllRoles } from './userRoles'

describe('userRoles', () => {
  describe('userHasRoles', () => {
    it.each([
      { roles: ['GLOBAL_SEARCH'], userRoles: ['GLOBAL_SEARCH'], result: true },
      { roles: ['GLOBAL_SEARCH'], userRoles: ['SOME_ROLE', 'GLOBAL_SEARCH'], result: true },
      { roles: ['GLOBAL_SEARCH'], userRoles: [], result: false },
      { roles: [], userRoles: ['GLOBAL_SEARCH'], result: false },
      { roles: ['GLOBAL_SEARCH', 'SOME_ROLE'], userRoles: ['SOME_ROLE'], result: true },
      { roles: ['GLOBAL_SEARCH'], userRoles: ['ROLE_GLOBAL_SEARCH'], result: true },
      { roles: ['ROLE_GLOBAL_SEARCH'], userRoles: ['GLOBAL_SEARCH'], result: true },
    ])('Should return the correct result when checking user roles', ({ roles, userRoles, result }) => {
      expect(userHasRoles(roles, userRoles)).toEqual(result)
    })
  })

  describe('userHasAllRoles', () => {
    it.each([
      { roles: ['GLOBAL_SEARCH'], userRoles: ['GLOBAL_SEARCH'], result: true },
      { roles: ['GLOBAL_SEARCH', 'SOME_ROLE'], userRoles: ['GLOBAL_SEARCH'], result: false },
      { roles: ['GLOBAL_SEARCH', 'SOME_ROLE'], userRoles: ['SOME_ROLE', 'GLOBAL_SEARCH'], result: true },
      { roles: ['GLOBAL_SEARCH', 'SOME_ROLE'], userRoles: ['GLOBAL_SEARCH', 'SOME_ROLE'], result: true },
      { roles: ['GLOBAL_SEARCH', 'SOME_ROLE'], userRoles: ['GLOBAL_SEARCH', 'SOME_ROLE', 'OTHER_ROLE'], result: true },
    ])('Should return the correct result when checking user roles', ({ roles, userRoles, result }) => {
      expect(userHasAllRoles(roles, userRoles)).toEqual(result)
    })
  })
})
