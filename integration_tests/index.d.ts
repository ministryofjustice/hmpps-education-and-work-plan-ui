declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to signIn. Set failOnStatusCode to false if you expect and non 200 return code
     * @example cy.signIn({ failOnStatusCode: boolean })
     */
    signIn(options?: { failOnStatusCode: boolean }): Chainable<AUTWindow>

    wiremockVerify(requestPatternBuilder: RequestPatternBuilder, expectedCount?: number): Chainable<*>

    wiremockVerifyNoInteractions(requestPatternBuilder: RequestPatternBuilder): Chainable<*>

    signInAsUserWithViewAuthorityToArriveOnPrisonerListPage()

    signInAsUserWithEditAuthorityToArriveOnPrisonerListPage()

    updateShortQuestionSetInductionToArriveOnCheckYourAnswers(prisonNumber?: string)

    updateLongQuestionSetInductionToArriveOnCheckYourAnswers(prisonNumber?: string)

    createLongQuestionSetInductionToArriveOnCheckYourAnswers(prisonNumber?: string)
  }
}
