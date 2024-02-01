import type { TimelineEvent } from 'viewModels'

export default function formatPrisonMovementEventFilter(event: TimelineEvent): string {
  const { eventType } = event
  const timelineEventValue = PrisonMovementEventValue[eventType as keyof typeof PrisonMovementEventValue]

  if (eventType === 'PRISON_ADMISSION' || eventType === 'PRISON_RELEASE') {
    return timelineEventValue.replace('[PRISON]', event.prison.prisonName || event.prison.prisonId)
  }
  if (eventType === 'PRISON_TRANSFER') {
    return timelineEventValue
      .replace('[OLD_PRISON]', event.contextualInfo)
      .replace('[NEW_PRISON]', event.prison.prisonName || event.prison.prisonId)
  }

  return timelineEventValue
}

enum PrisonMovementEventValue {
  PRISON_ADMISSION = 'Entered [PRISON]',
  PRISON_RELEASE = 'Released from [PRISON]',
  PRISON_TRANSFER = 'Transferred to [NEW_PRISON] from [OLD_PRISON]',
}
