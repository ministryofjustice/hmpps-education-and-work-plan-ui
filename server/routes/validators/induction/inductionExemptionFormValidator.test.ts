import type { InductionExemptionForm } from 'inductionForms'
import validateInductionExemption from './inductionExemptionFormValidator'
import InductionScheduleStatusValue from '../../../enums/inductionScheduleStatusValue'

describe('inductionExemptionFormValidator', () => {
  it('should validate given a valid induction exemption form', () => {
    // Given
    const inductionExemptionForm: InductionExemptionForm = {
      exemptionReason: InductionScheduleStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES,
      exemptionReasonDetails: {
        [InductionScheduleStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES]: 'Prisoner not feeling well today',
      },
    }

    // When
    const errors = validateInductionExemption(inductionExemptionForm)

    // Then
    expect(errors).toStrictEqual([])
  })

  it('should validate given no induction exemption reason', () => {
    // Given
    const inductionExemptionForm: InductionExemptionForm = {
      exemptionReason: undefined,
      exemptionReasonDetails: {
        [InductionScheduleStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES]: 'Prisoner not feeling well today',
      },
    }

    // When
    const errors = validateInductionExemption(inductionExemptionForm)

    // Then
    expect(errors).toEqual([
      { href: '#exemptionReason', text: 'Select an exemption reason to put the induction on hold' },
    ])
  })

  it('should validate given induction exemption details exceeds maximum length', () => {
    // Given
    const inductionExemptionForm: InductionExemptionForm = {
      exemptionReason: InductionScheduleStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES,
      exemptionReasonDetails: {
        [InductionScheduleStatusValue.EXEMPT_PRISONER_OTHER_HEALTH_ISSUES]: 'a'.repeat(201),
      },
    }

    // When
    const errors = validateInductionExemption(inductionExemptionForm)

    expect(errors).toEqual([
      { href: '#EXEMPT_PRISONER_OTHER_HEALTH_ISSUES', text: 'Exemption details must be 200 characters or less' },
    ])
  })
})
