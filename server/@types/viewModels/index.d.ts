declare module 'viewModels' {
  export interface PrisonerSummary {
    prisonNumber: string
    establishmentId: string // AKA prisonId
    releaseDate: string // TODO ideally change to a Date?
    location: string
    firstName: string
    lastName: string
  }

  export interface SupportNeeds {
    languageSupportNeeded: boolean
    lddAndHealthNeeds: Array<string>
    neurodiversity: Neurodiversity
  }

  export interface Neurodiversity {
    supportNeeded: Array<string>
    supportNeededRecordedDate: Date
    selfDeclaredNeurodiversity: Array<string>
    selfDeclaredRecordedDate: Date
    assessedNeurodiversity: Array<string>
    assessmentDate: Date
  }
}
