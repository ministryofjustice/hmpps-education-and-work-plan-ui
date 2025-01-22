import formatReviewExemptionReasonFilter from './formatReviewExemptionReasonFilter'

describe('formatExemptionReasonFilter', () => {
  describe('should format view model values', () => {
    Array.of(
      {
        source: 'EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY',
        expected: `Has a drug or alcohol dependency and is in assessment or treatment`,
      },
      {
        source: 'EXEMPT_PRISONER_OTHER_HEALTH_ISSUES',
        expected: `Has a health concern and is in assessment or treatment`,
      },
      {
        source: 'EXEMPT_PRISONER_FAILED_TO_ENGAGE',
        expected: `Has failed to engage or cooperate for a reason outside contractor's control`,
      },
      {
        source: 'EXEMPT_PRISONER_ESCAPED_OR_ABSCONDED',
        expected: `Has escaped, absconded or failed to return to prison`,
      },
      {
        source: 'EXEMPT_PRISON_REGIME_CIRCUMSTANCES',
        expected: `Prison regime changes or circumstances outside the contractor's control`,
      },
      { source: 'EXEMPT_PRISONER_SAFETY_ISSUES', expected: `Prisoner safety` },
      { source: 'EXEMPT_PRISON_STAFF_REDEPLOYMENT', expected: `Prison staff redeployed` },
      { source: 'EXEMPT_PRISON_OPERATION_OR_SECURITY_ISSUE', expected: `Prison operational or security reason` },
      { source: 'EXEMPT_SECURITY_ISSUE_RISK_TO_STAFF', expected: `Security issue that poses risk to staff` },
      {
        source: 'EXEMPT_SYSTEM_TECHNICAL_ISSUE',
        expected: `Review logged late due to technical issue with learning and work progress service`,
      },
    ).forEach(spec => {
      it(`source: ${spec.source}, expected: ${spec.expected}`, () => {
        expect(formatReviewExemptionReasonFilter(spec.source)).toEqual(spec.expected)
      })
    })
  })
})
