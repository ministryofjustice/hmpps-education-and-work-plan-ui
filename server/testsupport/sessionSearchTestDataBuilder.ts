import type { PrisonerSession, SessionSearch } from 'viewModels'
import { aValidPrisonerSession } from './prisonerSessionTestDataBuilder'

const aSessionSearch = (options?: {
  items?: Array<{ text: string; href: string; selected: boolean }>
  results?: { count: number; from: number; to: number }
  previous?: { href: string; text: string }
  next?: { href: string; text: string }
  sessions?: Array<PrisonerSession>
}): SessionSearch => ({
  pagination: {
    items: options?.items || [
      { text: '1', href: '?page=1', selected: true },
      { text: '2', href: '?page=2', selected: false },
    ],
    results: options?.results || { count: 5, from: 1, to: 2 },
    previous: options?.previous || { text: 'Previous', href: '?page=1' },
    next: options?.next || { text: 'Next', href: '?page=2' },
  },
  sessions: options?.sessions ?? [
    aValidPrisonerSession({ prisonNumber: 'A1234BC' }),
    aValidPrisonerSession({ prisonNumber: 'B4567CD' }),
  ],
})

export default aSessionSearch
