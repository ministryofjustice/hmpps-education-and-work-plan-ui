import formatPrisonMovementEventFilter from './formatPrisonMovementEventFilter'
import aTimelineEvent from '../testsupport/timelineEventTestDataBuilder'

describe('formatPrisonMovementEventFilter', () => {
  describe('should format prison movement event into a user friendly value', () => {
    Array.of(
      { timelineEvent: aTimelineEvent({ eventType: 'PRISON_ADMISSION' }), expected: 'Entered MDI' },
      { timelineEvent: aTimelineEvent({ eventType: 'PRISON_RELEASE' }), expected: 'Released from MDI' },
      {
        timelineEvent: aTimelineEvent({
          eventType: 'PRISON_TRANSFER',
          contextualInfo: { PRISON_TRANSFERRED_FROM: 'BXI' },
        }),
        expected: 'Transferred to MDI from BXI',
      },
    ).forEach(spec => {
      it(`Prison movement event value ${spec.timelineEvent}, expected text: ${spec.expected}`, () => {
        expect(formatPrisonMovementEventFilter(spec.timelineEvent)).toEqual(spec.expected)
      })
    })
  })

  describe('should not format non prison movement event', () => {
    it(`Prison movement event value 'ACTION_PLAN_CREATED', expected text: undefined`, () => {
      expect(formatPrisonMovementEventFilter(aTimelineEvent({ eventType: 'ACTION_PLAN_CREATED' }))).toEqual(undefined)
    })
  })
})
