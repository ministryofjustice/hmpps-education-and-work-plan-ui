import type { PagedCollectionOfPrisoners, Prisoner } from 'prisonRegisterApiClient'
import aValidPrisoner from './prisonerTestDataBuilder'

export default function aValidPagedCollectionOfPrisoners(options?: {
  totalPages?: number
  totalElements?: number
  first?: boolean
  last?: boolean
  size?: number
  number?: number
  content?: Prisoner[]
}): PagedCollectionOfPrisoners {
  return {
    totalPages: options?.totalPages || 1,
    totalElements: options?.totalElements || 1,
    first: !options || options.first === null || options.first === undefined ? true : options.first,
    last: !options || options.last === null || options.last === undefined ? true : options.last,
    size: options?.size || 9999,
    number: options?.number || 1,
    content: options?.content || [aValidPrisoner()],
  }
}
