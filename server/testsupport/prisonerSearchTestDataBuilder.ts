import type { PrisonerSearch, PrisonerSearchSummary } from 'viewModels'
import aValidPrisonerSearchSummary from './prisonerSearchSummaryTestDataBuilder'

const aValidPrisonerSearch = (options?: {
  items?: Array<{ text: string; href: string; selected: boolean }>
  results?: { count: number; from: number; to: number }
  previous?: { href: string; text: string }
  next?: { href: string; text: string }
  prisoners?: Array<PrisonerSearchSummary>
}): PrisonerSearch => ({
  pagination: {
    items: options?.items || [
      { text: '1', href: '?page=1', selected: true },
      { text: '2', href: '?page=2', selected: false },
    ],
    results: options?.results || { count: 5, from: 1, to: 2 },
    previous: options?.previous || { text: 'Previous', href: '?page=1' },
    next: options?.next || { text: 'Next', href: '?page=2' },
  },
  prisoners: options?.prisoners ?? [
    aValidPrisonerSearchSummary({ prisonNumber: 'A1234BC', hasCiagInduction: null, hasActionPlan: null }),
    aValidPrisonerSearchSummary({ prisonNumber: 'B4567CD', hasCiagInduction: null, hasActionPlan: null }),
  ],
})

export default aValidPrisonerSearch
