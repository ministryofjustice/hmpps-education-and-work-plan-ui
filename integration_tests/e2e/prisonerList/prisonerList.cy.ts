import Page from '../../pages/page'
import PrisonerListPage from '../../pages/prisonerList/PrisonerListPage'

context(`Display the prisoner list screen`, () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithViewAuthority')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
  })

  it('should be able to navigate directly to the prisoner list page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit('/')

    // Then
    const prisonerListPage = Page.verifyOnPage(PrisonerListPage)
    prisonerListPage.hasResultsDisplayed()
  })

  it('should search for non existent prisoner and get zero results', () => {
    // Given
    cy.signIn()
    cy.visit('/')
    const prisonerListPage = Page.verifyOnPage(PrisonerListPage)

    // When
    prisonerListPage //
      .setNameFilter('some non existent search term')
      .applyFilters()

    // Then
    prisonerListPage.hasNoResultsDisplayed()
  })

  it('should clear filters to reset the search', () => {
    // Given
    cy.signIn()
    cy.visit('/')
    const prisonerListPage = Page.verifyOnPage(PrisonerListPage)
    prisonerListPage //
      .setNameFilter('some non existent search term')
      .setStatusFilter('NEEDS_PLAN')
      .applyFilters()
      .hasNoResultsDisplayed()

    // When
    prisonerListPage.clearFilters()

    // Then
    prisonerListPage //
      .hasResultsDisplayed()
      .hasNoSearchTerm()
      .hasNoStatusFilter()
  })
})
