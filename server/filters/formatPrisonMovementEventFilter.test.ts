import formatPrisonMovementEventFilter from './formatPrisonMovementEventFilter'
import aTimelineEvent from '../testsupport/timelineEventTestDataBuilder'

describe('formatPrisonMovementEventFilter', () => {
  describe('should format API event into a user friendly value', () => {
    Array.of(
      { timelineEvent: aTimelineEvent({ eventType: 'PRISON_ADMISSION' }), expected: 'Entered MDI' },
      { timelineEvent: aTimelineEvent({ eventType: 'PRISON_RELEASE' }), expected: 'Released from MDI' },
      {
        timelineEvent: aTimelineEvent({ eventType: 'PRISON_TRANSFER', contextualInfo: 'BXI' }),
        expected: 'Transferred to MDI from BXI',
      },
    ).forEach(spec => {
      it(`Timeline event value ${spec.timelineEvent}, expected text: ${spec.expected}`, () => {
        expect(formatPrisonMovementEventFilter(spec.timelineEvent)).toEqual(spec.expected)
      })
    })
  })
})
