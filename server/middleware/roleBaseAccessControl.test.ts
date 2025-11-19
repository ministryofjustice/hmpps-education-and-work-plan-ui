import { userWithRoleCan } from './roleBasedAccessControl'
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
      ]

      // When
      const actual = userWithRoleCan(DpsRole.ROLE_LWP_CONTRIBUTOR)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return the actions a user with ROLE_MATCH_LEARNER_RECORD_RW can perform', () => {
      // Given
      const expected = [ApplicationAction.USE_DPS_LEARNER_RECORD_MATCHING_SERVICE]

      // When
      const actual = userWithRoleCan(DpsRole.ROLE_MATCH_LEARNER_RECORD_RW)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
