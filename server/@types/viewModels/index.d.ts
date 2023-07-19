declare module 'viewModels' {
  export interface PrisonerSummary {
    prisonNumber: string
    releaseDate: string // TODO ideally change to a Date?
    location: string
    firstName: string
    lastName: string
  }

  export interface PrisonerSupportNeeds {
    healthAndSupportNeeds: Array<HealthAndSupportNeeds>
    neurodiversities: Array<Neurodiversity>
  }

  export interface HealthAndSupportNeeds {
    prisonId: string
    prisonName: string
    languageSupportNeeded: string
    lddAndHealthNeeds: Array<string>
  }

  export interface Neurodiversity {
    prisonId: string
    prisonName: string
    supportNeeded: Array<string>
    supportNeededRecordedDate: Date
    selfDeclaredNeurodiversity: Array<string>
    selfDeclaredRecordedDate: Date
    assessedNeurodiversity: Array<string>
    assessmentDate: Date
  }
}
