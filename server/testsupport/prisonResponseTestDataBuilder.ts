import type { PrisonResponse } from 'prisonRegisterApiClient'

const aValidPrisonResponse = (options?: {
  prisonId?: string
  prisonName?: string
  active?: boolean
}): PrisonResponse => {
  return {
    prisonId: options?.prisonId || 'MDI',
    prisonName: options?.prisonName || 'Moorland (HMP & YOI)',
    active: !options || options.active === null || options.active === undefined ? true : options.active,
    male: true,
    female: false,
    contracted: false,
    types: [
      {
        code: 'YOI',
        description: 'Her Majesty’s Youth Offender Institution',
      },
      {
        code: 'HMP',
        description: 'Her Majesty’s Prison',
      },
    ],
    categories: ['C'],
    addresses: [
      {
        id: 77,
        addressLine1: 'Bawtry Road',
        addressLine2: 'Hatfield Woodhouse',
        town: 'Doncaster',
        county: 'South Yorkshire',
        postcode: 'DN7 6BW',
        country: 'England',
      },
    ],
    operators: [
      {
        name: 'PSP',
      },
    ],
  }
}

export default aValidPrisonResponse
