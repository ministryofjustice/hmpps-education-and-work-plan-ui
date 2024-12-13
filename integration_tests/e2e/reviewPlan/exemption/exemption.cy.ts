import Page from '../../../pages/page'
import AuthorisationErrorPage from '../../../pages/authorisationError'
import ReviewScheduleStatusValue from '../../../../server/enums/reviewScheduleStatusValue'
import ExemptionReasonPage from '../../../pages/reviewPlan/exemption/exemptionPage'
import ConfirmExemptionPage from '../../../pages/reviewPlan/exemption/confirmExemptionPage'

context(`Review exemption page`, () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('stubGetAllPrisons')
  })

  it('should redirect to auth-error page given user does not have edit authority', () => {
    // Given
    cy.task('stubSignInAsReadOnlyUser')
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/review/exemption`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it('should be able to navigate directly to Exemption page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/review/exemption`)

    // Then
    Page.verifyOnPage(ExemptionReasonPage)
  })

  it(`should complete the exemption form, triggering validation`, () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/review/exemption`)

    // When
    Page.verifyOnPage(ExemptionReasonPage) //
      .submitPage() // submit the page without answering any questions to trigger exemption reason validation error
    Page.verifyOnPage(ExemptionReasonPage) //
      .hasErrorCount(1)
      .hasFieldInError('exemptionReason')
      .selectExemptionReason(ReviewScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY)
      .enterExemptionReasonDetails(
        ReviewScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY,
        'a'.repeat(201),
      )
      .submitPage() // submit the page with too many characters in the exemption reason to trigger an exemption reason details validation error
    Page.verifyOnPage(ExemptionReasonPage) //
      .hasErrorCount(1)
      .hasFieldInError('EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY')
      .enterExemptionReasonDetails(ReviewScheduleStatusValue.EXEMPT_PRISONER_DRUG_OR_ALCOHOL_DEPENDENCY, 'In treatment')
      .submitPage() // submit the page with valid responses to redirect to confirm exemption page
    Page.verifyOnPage(ConfirmExemptionPage) //

    // Then
    // TODO - assert API was called with correct values
  })
})
