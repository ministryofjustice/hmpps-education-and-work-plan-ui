import { startOfDay } from 'date-fns'
import toPrisonerSessions from './prisonerSessionMapper'
import { aValidSessionResponse, aValidSessionResponses } from '../../testsupport/sessionResponseTestDataBuilder'
import SessionTypeValue from '../../enums/sessionTypeValue'
import { aValidPrisonerSession, aValidSessions } from '../../testsupport/prisonerSessionTestDataBuilder'
import ReviewScheduleStatusValue from '../../enums/reviewScheduleStatusValue'
import InductionScheduleStatusValue from '../../enums/inductionScheduleStatusValue'

describe('prisonerSessionMapper', () => {
  it('should map to PrisonerSessions given session does not have exemption details', () => {
    // Given
    const sessionResponses = aValidSessionResponses({
      sessions: [
        aValidSessionResponse({
          reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
          prisonNumber: 'A1234BC',
          sessionType: 'REVIEW',
          deadlineDate: '2025-02-10',
          exemptionReason: null,
          exemptionDate: null,
        }),
      ],
    })

    const expected = aValidSessions({
      sessions: [
        aValidPrisonerSession({
          reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
          prisonNumber: 'A1234BC',
          sessionType: SessionTypeValue.REVIEW,
          deadlineDate: startOfDay('2025-02-10'),
          exemption: undefined,
          firstName: null,
          lastName: null,
          location: null,
          releaseDate: null,
        }),
      ],
    })

    // When
    const actual = toPrisonerSessions(sessionResponses)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to PrisonerSessions given session includes Review exemption details', () => {
    // Given
    const sessionResponses = aValidSessionResponses({
      sessions: [
        aValidSessionResponse({
          reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
          prisonNumber: 'A1234BC',
          sessionType: 'REVIEW',
          deadlineDate: '2025-02-10',
          exemptionReason: 'EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY',
          exemptionDate: '2025-02-05',
        }),
      ],
    })

    const expected = aValidSessions({
      sessions: [
        aValidPrisonerSession({
          reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
          prisonNumber: 'A1234BC',
          sessionType: SessionTypeValue.REVIEW,
          deadlineDate: startOfDay('2025-02-10'),
          exemption: {
            exemptionReason: ReviewScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
            exemptionDate: startOfDay('2025-02-05'),
          },
          firstName: null,
          lastName: null,
          location: null,
          releaseDate: null,
        }),
      ],
    })

    // When
    const actual = toPrisonerSessions(sessionResponses)

    // Then
    expect(actual).toEqual(expected)
  })
  it('should map to PrisonerSessions given session includes Induction exemption details', () => {
    // Given
    const sessionResponses = aValidSessionResponses({
      sessions: [
        aValidSessionResponse({
          reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
          prisonNumber: 'A1234BC',
          sessionType: 'INDUCTION',
          deadlineDate: '2025-02-10',
          exemptionReason: 'EXEMPT_SCREENING_AND_ASSESSMENT_IN_PROGRESS',
          exemptionDate: '2025-02-05',
        }),
      ],
    })

    const expected = aValidSessions({
      sessions: [
        aValidPrisonerSession({
          reference: 'c88a6c48-97e2-4c04-93b5-98619966447b',
          prisonNumber: 'A1234BC',
          sessionType: SessionTypeValue.INDUCTION,
          deadlineDate: startOfDay('2025-02-10'),
          exemption: {
            exemptionReason: InductionScheduleStatusValue.EXEMPT_SCREENING_AND_ASSESSMENT_IN_PROGRESS,
            exemptionDate: startOfDay('2025-02-05'),
          },
          firstName: null,
          lastName: null,
          location: null,
          releaseDate: null,
        }),
      ],
    })

    // When
    const actual = toPrisonerSessions(sessionResponses)

    // Then
    expect(actual).toEqual(expected)
  })
})
