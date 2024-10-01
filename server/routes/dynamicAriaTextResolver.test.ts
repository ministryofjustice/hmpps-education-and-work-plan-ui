import { Request, Response } from 'express'
import getDynamicBackLinkAriaText from './dynamicAriaTextResolver'
import aValidPrisonerSummary from '../testsupport/prisonerSummaryTestDataBuilder'

describe('getDynamicBackLinkAriaText', () => {
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    params: { prisonNumber },
  } as unknown as Request
  const res = {
    locals: { prisonerSummary },
  } as unknown as Response

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

        // When
        const actual = getDynamicBackLinkAriaText(req, res, spec.uri)

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

        // When
        const actual = getDynamicBackLinkAriaText(req, res, spec.uri)

        // Then
        expect(actual).toEqual(spec.expectedText)
      })
    })
  })
})
