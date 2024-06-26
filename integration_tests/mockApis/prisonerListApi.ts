import type { PrisonerSearchSummary } from 'viewModels'
import { format } from 'date-fns'
import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

const stubPrisonerList = (prisonId = 'BXI', page = 0, pageSize = 9999): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/prisoner-search-api/prisoner-search/prison/${prisonId}`,
      queryParameters: {
        page: { equalTo: `${page}` },
        size: { equalTo: `${pageSize}` },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: [
          {
            prisonerNumber: 'A5194DY',
            bookingId: '1201725',
            bookNumber: '38843A',
            firstName: 'HARRIET',
            lastName: 'KANE',
            dateOfBirth: '1993-07-29',
            gender: 'Male',
            youthOffender: false,
            status: 'ACTIVE IN',
            lastMovementTypeCode: 'ADM',
            lastMovementReasonCode: 'INT',
            inOutStatus: 'IN',
            prisonId: 'BXI',
            prisonName: 'Brixton (HMP)',
            cellLocation: 'A-1-032',
            aliases: [
              {
                firstName: 'HARRY',
                lastName: 'KANE',
                dateOfBirth: '1993-07-28',
                gender: 'Male',
              },
            ],
            alerts: [
              {
                alertType: 'H',
                alertCode: 'HA',
                active: true,
                expired: false,
              },
              {
                alertType: 'X',
                alertCode: 'XER',
                active: true,
                expired: false,
              },
              {
                alertType: 'W',
                alertCode: 'WO',
                active: true,
                expired: false,
              },
              {
                alertType: 'M',
                alertCode: 'PEEP',
                active: true,
                expired: false,
              },
              {
                alertType: 'M',
                alertCode: 'MHT',
                active: true,
                expired: false,
              },
              {
                alertType: 'M',
                alertCode: 'MEP',
                active: true,
                expired: false,
              },
              {
                alertType: 'O',
                alertCode: 'OCVM',
                active: true,
                expired: false,
              },
              {
                alertType: 'H',
                alertCode: 'HC',
                active: true,
                expired: false,
              },
              {
                alertType: 'P',
                alertCode: 'PC1',
                active: true,
                expired: false,
              },
              {
                alertType: 'R',
                alertCode: 'RDV',
                active: true,
                expired: false,
              },
              {
                alertType: 'F1',
                alertCode: 'F1',
                active: true,
                expired: false,
              },
              {
                alertType: 'H',
                alertCode: 'HS',
                active: true,
                expired: false,
              },
              {
                alertType: 'M',
                alertCode: 'MSI',
                active: true,
                expired: false,
              },
              {
                alertType: 'M',
                alertCode: 'MFL',
                active: true,
                expired: false,
              },
              {
                alertType: 'R',
                alertCode: 'ROV',
                active: true,
                expired: false,
              },
              {
                alertType: 'X',
                alertCode: 'XCO',
                active: true,
                expired: false,
              },
              {
                alertType: 'O',
                alertCode: 'CSIP',
                active: true,
                expired: false,
              },
              {
                alertType: 'D',
                alertCode: 'DOCGM',
                active: true,
                expired: false,
              },
              {
                alertType: 'X',
                alertCode: 'XA',
                active: true,
                expired: false,
              },
              {
                alertType: 'O',
                alertCode: 'ONCR',
                active: true,
                expired: false,
              },
              {
                alertType: 'O',
                alertCode: 'OCYP',
                active: true,
                expired: false,
              },
              {
                alertType: 'O',
                alertCode: 'OIOM',
                active: true,
                expired: false,
              },
              {
                alertType: 'O',
                alertCode: 'OHCO',
                active: true,
                expired: false,
              },
            ],
            category: 'C',
            legalStatus: 'SENTENCED',
            imprisonmentStatus: 'RECEP_DET',
            imprisonmentStatusDescription: 'Determinate sentence (reception)',
            mostSeriousOffence: 'Adult cause a child to participate in a lottery - Gambling Act 2005',
            recall: false,
            indeterminateSentence: false,
            releaseDate: '2020-02-03',
            sentenceExpiryDate: '2020-02-03',
            licenceExpiryDate: '2020-02-03',
            homeDetentionCurfewEligibilityDate: '2020-02-03',
            topupSupervisionStartDate: '2020-02-04',
            topupSupervisionExpiryDate: '2020-02-03',
            nonDtoReleaseDate: '2020-02-03',
            nonDtoReleaseDateType: 'ARD',
            receptionDate: '2021-12-13',
            paroleEligibilityDate: '2020-02-03',
            automaticReleaseDate: '2020-02-03',
            postRecallReleaseDate: '2020-02-03',
            conditionalReleaseDate: '2020-02-03',
            tariffDate: '2020-02-03',
            locationDescription: 'Brixton (HMP)',
            restrictedPatient: false,
            currentIncentive: {
              level: {
                code: 'BAS',
                description: 'Basic',
              },
              dateTime: '2023-08-10T16:54:53',
              nextReviewDate: '2023-06-07',
            },
          },
          {
            prisonerNumber: 'A5502DZ',
            bookingId: '1209043',
            bookNumber: '45919A',
            firstName: 'JOHN',
            lastName: 'NOAKES',
            dateOfBirth: '1967-01-02',
            gender: 'Male',
            youthOffender: false,
            status: 'ACTIVE IN',
            lastMovementTypeCode: 'ADM',
            lastMovementReasonCode: 'I',
            inOutStatus: 'IN',
            prisonId: 'BXI',
            prisonName: 'Brixton (HMP)',
            cellLocation: 'A-1-027',
            aliases: [],
            alerts: [],
            legalStatus: 'SENTENCED',
            imprisonmentStatus: 'ADIMP_ORA20',
            imprisonmentStatusDescription: 'ORA 2020 Standard Determinate Sentence',
            mostSeriousOffence: 'Abandon a fighting dog',
            recall: false,
            indeterminateSentence: false,
            sentenceStartDate: '2023-07-26',
            releaseDate: '2029-07-18',
            sentenceExpiryDate: '2035-07-18',
            licenceExpiryDate: '2035-07-18',
            nonDtoReleaseDate: '2029-07-18',
            nonDtoReleaseDateType: 'CRD',
            receptionDate: '2023-07-26',
            conditionalReleaseDate: '2029-07-18',
            locationDescription: 'Brixton (HMP)',
            restrictedPatient: false,
            currentIncentive: {
              level: {
                code: 'STD',
                description: 'Standard',
              },
              dateTime: '2023-07-26T11:13:38',
              nextReviewDate: '2023-10-26',
            },
          },
          {
            prisonerNumber: 'A8335DY',
            bookingId: '1201879',
            bookNumber: '38985A',
            firstName: 'NORMAAX',
            middleNames: 'STANLEAX',
            lastName: 'FLETCHEAX',
            dateOfBirth: '2000-01-01',
            gender: 'Male',
            youthOffender: false,
            status: 'ACTIVE IN',
            lastMovementTypeCode: 'ADM',
            lastMovementReasonCode: 'INT',
            inOutStatus: 'IN',
            prisonId: 'BXI',
            prisonName: 'Brixton (HMP)',
            cellLocation: 'RECP',
            aliases: [],
            alerts: [],
            legalStatus: 'SENTENCED',
            imprisonmentStatus: 'SENT03',
            imprisonmentStatusDescription: 'Adult Imprisonment Without Option CJA03',
            recall: false,
            indeterminateSentence: false,
            receptionDate: '2022-02-17',
            locationDescription: 'Brixton (HMP)',
            restrictedPatient: false,
            currentIncentive: {
              level: {
                code: 'STD',
                description: 'Standard',
              },
              dateTime: '2022-02-18T13:00:59',
              nextReviewDate: '2023-02-18',
            },
          },
        ],
      },
    },
  })

const stubPrisonerListFromPrisonerSearchSummaries = (
  prisonerSearchSummaries: Array<PrisonerSearchSummary>,
  options?: {
    prisonId?: string
    page?: number
    pageSize?: number
  },
): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/prisoner-search-api/prisoner-search/prison/${options?.prisonId || 'BXI'}`,
      queryParameters: {
        page: { equalTo: `${options?.page || 0}` },
        size: { equalTo: `${options?.pageSize || 9999}` },
      },
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        content: prisonerSearchSummaries.map(prisonerSearchSummary => {
          return {
            prisonId: prisonerSearchSummary.prisonId,
            prisonerNumber: prisonerSearchSummary.prisonNumber,
            firstName: prisonerSearchSummary.firstName,
            lastName: prisonerSearchSummary.lastName,
            dateOfBirth: prisonerSearchSummary.dateOfBirth
              ? format(prisonerSearchSummary.dateOfBirth, 'yyyy-MM-dd')
              : undefined,
            receptionDate: prisonerSearchSummary.receptionDate
              ? format(prisonerSearchSummary.receptionDate, 'yyyy-MM-dd')
              : undefined,
            releaseDate: prisonerSearchSummary.releaseDate
              ? format(prisonerSearchSummary.releaseDate, 'yyyy-MM-dd')
              : undefined,
            cellLocation: prisonerSearchSummary.location,
          }
        }),
      },
    },
  })

const stubPrisonerList500error = (prisonId = 'BXI', page = 0, pageSize = 9999): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/prisoner-search-api/prisoner-search/prison/${prisonId}`,
      queryParameters: {
        page: { equalTo: `${page}` },
        size: { equalTo: `${pageSize}` },
      },
    },
    response: {
      status: 500,
      body: 'Unexpected error',
    },
  })

export default {
  stubPrisonerList,
  stubPrisonerList500error,
  stubPrisonerListFromPrisonerSearchSummaries,
}
