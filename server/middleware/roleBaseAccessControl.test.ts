import { userHasPermissionTo, userWithRoleCan } from './roleBasedAccessControl'
import DpsRole from '../enums/dpsRole'
import ApplicationAction from '../enums/applicationAction'

describe('roleBasedAccessControl', () => {
  describe('userWithRoleCan', () => {
    it('should return the actions a user with ROLE_LWP_MANAGER can perform', () => {
      // Given
      const expected = [
        ApplicationAction.RECORD_INDUCTION,
        ApplicationAction.EXEMPT_INDUCTION,
        ApplicationAction.REMOVE_INDUCTION_EXEMPTION,
        ApplicationAction.UPDATE_INDUCTION,
        ApplicationAction.RECORD_EDUCATION,
        ApplicationAction.UPDATE_EDUCATION,
        ApplicationAction.RECORD_REVIEW,
        ApplicationAction.EXEMPT_REVIEW,
        ApplicationAction.REMOVE_REVIEW_EXEMPTION,
        ApplicationAction.CREATE_GOALS,
        ApplicationAction.UPDATE_GOALS,
        ApplicationAction.COMPLETE_AND_ARCHIVE_GOALS,
        ApplicationAction.VIEW_SESSION_SUMMARIES,
        ApplicationAction.VIEW_EMPLOYABILITY_SKILLS,
        ApplicationAction.ADD_EMPLOYABILITY_SKILLS_RATING,
        ApplicationAction.VIEW_EMPLOYABILITY_SKILL_RATINGS,
      ]

      // When
      const actual = userWithRoleCan(DpsRole.ROLE_LWP_MANAGER)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return the actions a user with ROLE_LWP_CONTRIBUTOR can perform', () => {
      // Given
      const expected = [
        ApplicationAction.UPDATE_INDUCTION,
        ApplicationAction.RECORD_EDUCATION,
        ApplicationAction.UPDATE_EDUCATION,
        ApplicationAction.VIEW_EMPLOYABILITY_SKILLS,
        ApplicationAction.ADD_EMPLOYABILITY_SKILLS_RATING,
        ApplicationAction.VIEW_EMPLOYABILITY_SKILL_RATINGS,
      ]

      // When
      const actual = userWithRoleCan(DpsRole.ROLE_LWP_CONTRIBUTOR)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return the actions a user with ROLE_MATCH_LEARNER_RECORD_RW can perform', () => {
      // Given
      const expected = [
        ApplicationAction.VIEW_EMPLOYABILITY_SKILLS,
        ApplicationAction.ADD_EMPLOYABILITY_SKILLS_RATING,
        ApplicationAction.VIEW_EMPLOYABILITY_SKILL_RATINGS,
        ApplicationAction.USE_DPS_LEARNER_RECORD_MATCHING_SERVICE,
      ]

      // When
      const actual = userWithRoleCan(DpsRole.ROLE_MATCH_LEARNER_RECORD_RW)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('userHasPermissionTo', () => {
    it.each([
      ApplicationAction.RECORD_INDUCTION,
      ApplicationAction.EXEMPT_INDUCTION,
      ApplicationAction.REMOVE_INDUCTION_EXEMPTION,
      ApplicationAction.UPDATE_INDUCTION,
      ApplicationAction.RECORD_EDUCATION,
      ApplicationAction.UPDATE_EDUCATION,
      ApplicationAction.RECORD_REVIEW,
      ApplicationAction.EXEMPT_REVIEW,
      ApplicationAction.REMOVE_REVIEW_EXEMPTION,
      ApplicationAction.CREATE_GOALS,
      ApplicationAction.UPDATE_GOALS,
      ApplicationAction.COMPLETE_AND_ARCHIVE_GOALS,
      ApplicationAction.VIEW_SESSION_SUMMARIES,
      ApplicationAction.VIEW_EMPLOYABILITY_SKILLS,
      ApplicationAction.ADD_EMPLOYABILITY_SKILLS_RATING,
      ApplicationAction.VIEW_EMPLOYABILITY_SKILL_RATINGS,
    ])('user with ROLE_LWP_MANAGER has permission to %s', applicationAction => {
      // Given
      const userRoles = [DpsRole.ROLE_LWP_MANAGER]

      // When
      const actual = userHasPermissionTo(applicationAction, userRoles)

      // Then
      expect(actual).toEqual(true)
    })

    it.each([ApplicationAction.USE_DPS_LEARNER_RECORD_MATCHING_SERVICE])(
      'user with ROLE_LWP_MANAGER does not have permission to %s',
      applicationAction => {
        // Given
        const userRoles = [DpsRole.ROLE_LWP_MANAGER]

        // When
        const actual = userHasPermissionTo(applicationAction, userRoles)

        // Then
        expect(actual).toEqual(false)
      },
    )

    it.each([
      ApplicationAction.UPDATE_INDUCTION,
      ApplicationAction.RECORD_EDUCATION,
      ApplicationAction.UPDATE_EDUCATION,
      ApplicationAction.VIEW_EMPLOYABILITY_SKILLS,
      ApplicationAction.ADD_EMPLOYABILITY_SKILLS_RATING,
      ApplicationAction.VIEW_EMPLOYABILITY_SKILL_RATINGS,
    ])('user with ROLE_LWP_CONTRIBUTOR has permission to %s', applicationAction => {
      // Given
      const userRoles = [DpsRole.ROLE_LWP_CONTRIBUTOR]

      // When
      const actual = userHasPermissionTo(applicationAction, userRoles)

      // Then
      expect(actual).toEqual(true)
    })

    it.each([
      ApplicationAction.RECORD_INDUCTION,
      ApplicationAction.EXEMPT_INDUCTION,
      ApplicationAction.REMOVE_INDUCTION_EXEMPTION,
      ApplicationAction.RECORD_REVIEW,
      ApplicationAction.EXEMPT_REVIEW,
      ApplicationAction.REMOVE_REVIEW_EXEMPTION,
      ApplicationAction.CREATE_GOALS,
      ApplicationAction.UPDATE_GOALS,
      ApplicationAction.COMPLETE_AND_ARCHIVE_GOALS,
      ApplicationAction.VIEW_SESSION_SUMMARIES,
      ApplicationAction.USE_DPS_LEARNER_RECORD_MATCHING_SERVICE,
    ])('user with ROLE_LWP_CONTRIBUTOR does not have permission to %s', applicationAction => {
      // Given
      const userRoles = [DpsRole.ROLE_LWP_CONTRIBUTOR]

      // When
      const actual = userHasPermissionTo(applicationAction, userRoles)

      // Then
      expect(actual).toEqual(false)
    })

    it.each([
      ApplicationAction.VIEW_EMPLOYABILITY_SKILLS,
      ApplicationAction.ADD_EMPLOYABILITY_SKILLS_RATING,
      ApplicationAction.VIEW_EMPLOYABILITY_SKILL_RATINGS,
    ])('user with no LWP roles has permission to %s', applicationAction => {
      // Given
      const userRoles: Array<DpsRole> = []

      // When
      const actual = userHasPermissionTo(applicationAction, userRoles)

      // Then
      expect(actual).toEqual(true)
    })

    it.each([
      ApplicationAction.UPDATE_INDUCTION,
      ApplicationAction.RECORD_EDUCATION,
      ApplicationAction.UPDATE_EDUCATION,
      ApplicationAction.RECORD_INDUCTION,
      ApplicationAction.EXEMPT_INDUCTION,
      ApplicationAction.REMOVE_INDUCTION_EXEMPTION,
      ApplicationAction.RECORD_REVIEW,
      ApplicationAction.EXEMPT_REVIEW,
      ApplicationAction.REMOVE_REVIEW_EXEMPTION,
      ApplicationAction.CREATE_GOALS,
      ApplicationAction.UPDATE_GOALS,
      ApplicationAction.COMPLETE_AND_ARCHIVE_GOALS,
      ApplicationAction.VIEW_SESSION_SUMMARIES,
      ApplicationAction.USE_DPS_LEARNER_RECORD_MATCHING_SERVICE,
    ])('user with no LWP roles does not have permission to %s', applicationAction => {
      // Given
      const userRoles: Array<DpsRole> = []

      // When
      const actual = userHasPermissionTo(applicationAction, userRoles)

      // Then
      expect(actual).toEqual(false)
    })

    it.each([
      'ROLE_MATCH_LEARNER_RECORD_RW',
      'ROLE_LWP_MANAGER, ROLE_MATCH_LEARNER_RECORD_RW',
      'ROLE_LWP_CONTRIBUTOR, ROLE_MATCH_LEARNER_RECORD_RW',
      'ROLE_LWP_CONTRIBUTOR, ROLE_LWP_MANAGER, ROLE_MATCH_LEARNER_RECORD_RW',
    ])('user with roles %s has permission to USE_DPS_LEARNER_RECORD_MATCHING_SERVICE', roles => {
      // Given
      const userRoles = roles.split(',').map(role => role.trim() as DpsRole)

      // When
      const actual = userHasPermissionTo(ApplicationAction.USE_DPS_LEARNER_RECORD_MATCHING_SERVICE, userRoles)

      // Then
      expect(actual).toEqual(true)
    })
  })
})
