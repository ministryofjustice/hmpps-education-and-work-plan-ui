import { format } from 'date-fns'

export default class TimelineApiFilterOptions {
  public queryParams: {
    inductions: boolean
    reviews: boolean
    goals: boolean
    prisonEvents: boolean
    prisonId?: string
    eventsSince?: string
  }

  constructor(options?: {
    inductions?: boolean
    reviews?: boolean
    goals?: boolean
    prisonEvents?: boolean
    prisonId?: string
    eventsSince?: Date
  }) {
    const constructorArg = options || {}
    this.queryParams = {
      ...constructorArg,
      inductions: constructorArg.inductions == null ? false : constructorArg.inductions,
      reviews: constructorArg.reviews == null ? false : constructorArg.reviews,
      goals: constructorArg.goals == null ? false : constructorArg.goals,
      prisonEvents: constructorArg.prisonEvents == null ? false : constructorArg.prisonEvents,
      prisonId: constructorArg.prisonId,
      eventsSince: constructorArg.eventsSince ? format(constructorArg.eventsSince, 'yyyy-MM-dd') : undefined,
    }
  }
}
