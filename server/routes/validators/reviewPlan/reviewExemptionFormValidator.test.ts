import type { ReviewExemptionForm } from 'reviewPlanForms'
import validateReviewExemption from './reviewExemptionFormValidator'
import ReviewScheduleStatusValue from '../../../enums/reviewScheduleStatusValue'

describe('reviewExemptionFormValidator', () => {
  it('should validate given a valid review exemption form', () => {
    // Given
    const reviewExemptionForm: ReviewExemptionForm = {
      exemptionReason: ReviewScheduleStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES,
      exemptionReasonDetails: {
        [ReviewScheduleStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES]: 'Prisoner not feeling well today',
      },
    }

    // When
    const errors = validateReviewExemption(reviewExemptionForm)

    // Then
    expect(errors).toStrictEqual([])
  })

  it('should validate given no review exemption reason', () => {
    // Given
    const reviewExemptionForm: ReviewExemptionForm = {
      exemptionReason: undefined,
      exemptionReasonDetails: {
        [ReviewScheduleStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES]: 'Prisoner not feeling well today',
      },
    }

    // When
    const errors = validateReviewExemption(reviewExemptionForm)

    // Then
    expect(errors).toEqual([{ href: '#exemptionReason', text: 'Select an exemption reason to put the review on hold' }])
  })

  it('should validate given review exemption details exceeds maximum length', () => {
    // Given
    const reviewExemptionForm: ReviewExemptionForm = {
      exemptionReason: ReviewScheduleStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES,
      exemptionReasonDetails: {
        [ReviewScheduleStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES]: 'a'.repeat(201),
      },
    }

    // When
    const errors = validateReviewExemption(reviewExemptionForm)

    expect(errors).toEqual([
      { href: '#EXEMPT_PRISONER_OTHER_HEALTH_ISSUES', text: 'Exemption details must be 200 characters or less' },
    ])
  })
})
