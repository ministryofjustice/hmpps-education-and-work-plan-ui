import { SessionData } from 'express-session'
import { Request } from 'express'
import getDynamicBackLinkAriaText from './dynamicAriaTextResolver'
import aValidPrisonerSummary from '../testsupport/prisonerSummaryTestDataBuilder'

const req = {
  session: {} as SessionData,
  body: {},
  params: {} as Record<string, string>,
}

beforeEach(() => {
  req.session = {} as SessionData
  req.body = {}
  req.params = {} as Record<string, string>
})

describe('getDynamicBackLinkAriaText', () => {
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  describe('happy path - back link aria text is resolved', () => {
    Array.of<Record<string, string>>(
      {
        uri: '/prisoners/A1234BC/induction/highest-level-of-education',
        expectedText: `Back to What's the highest level of education Jimmy Lightfingers completed before entering prison?`,
      },
      {
        uri: '/prisoners/A1234BC/induction/qualifications',
        expectedText: `Back to Jimmy Lightfingers's qualifications`,
      },
      {
        uri: '/prisoners/A1234BC/induction/qualification-level',
        expectedText: `Back to What level of qualification does Jimmy Lightfingers want to add`,
      },
      {
        uri: '/prisoners/A1234BC/induction/qualification-details',
        expectedText: 'Back to Add a qualification',
      },
    ).forEach(spec => {
      it(`aria text for uri: ${spec.uri}`, () => {
        // Given
        req.params.prisonNumber = prisonNumber
        req.session.prisonerSummary = prisonerSummary

        // When
        const actual = getDynamicBackLinkAriaText(req as undefined as Request, spec.uri)

        // Then
        expect(actual).toEqual(spec.expectedText)
      })
    })
  })

  describe('unhappy path - back link aria text is not resolved', () => {
    Array.of<Record<string, string>>(
      {
        uri: '/prisoners/A1234BC/induction/highest-level-of-educatio',
        expectedText: ``,
      },
      {
        uri: '/induction/qualification-details',
        expectedText: '',
      },
      {
        uri: null,
        expectedText: ``,
      },
      {
        uri: undefined,
        expectedText: ``,
      },
      {
        uri: '',
        expectedText: ``,
      },
    ).forEach(spec => {
      it(`aria text for uri: ${spec.uri}`, () => {
        // Given
        req.params.prisonNumber = prisonNumber
        req.session.prisonerSummary = prisonerSummary

        // When
        const actual = getDynamicBackLinkAriaText(req as undefined as Request, spec.uri)

        // Then
        expect(actual).toEqual(spec.expectedText)
      })
    })
  })
})
