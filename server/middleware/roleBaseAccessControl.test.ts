import { userWithRoleCan } from './roleBasedAccessControl'
import ApplicationRole from '../enums/applicationRole'
import ApplicationAction from '../enums/applicationAction'

describe('roleBasedAccessControl', () => {
  describe('userWithRoleCan', () => {
    it('should return the actions a user with ROLE_EDUCATION_WORK_PLAN_EDITOR can perform', () => {
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
      ]

      // When
      const actual = userWithRoleCan(ApplicationRole.ROLE_EDUCATION_WORK_PLAN_EDITOR)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return the actions a user with ROLE_LEARNING_AND_WORK_PROGRESS_MANAGER can perform', () => {
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
      ]

      // When
      const actual = userWithRoleCan(ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_MANAGER)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should return the actions a user with ROLE_LEARNING_AND_WORK_PROGRESS_CONTRIBUTOR can perform', () => {
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
      ]

      // When
      const actual = userWithRoleCan(ApplicationRole.ROLE_LEARNING_AND_WORK_PROGRESS_CONTRIBUTOR)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
