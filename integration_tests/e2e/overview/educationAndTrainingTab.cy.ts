import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'

context('Prisoner Overview page - Education And Training tab', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
  })

  it('should display Education and Training data', () => {
    // Given
    cy.task('stubLearnerProfile')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Education and training')

    // Then
    overviewPage //
      .activeTabIs('Education and training')
      .hasFunctionalSkillsDisplayed()
  })

  it('should display Education and Training data given curious API returns a 404', () => {
    // Given
    cy.task('stubLearnerProfile404Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Education and training')

    // Then
    overviewPage //
      .activeTabIs('Education and training')
      .hasFunctionalSkillsDisplayed()
  })

  it('should display curious unavailable message given curious is unavailable', () => {
    // Given
    cy.task('stubLearnerProfile401Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Education and training')

    // Then
    overviewPage //
      .activeTabIs('Education and training')
      .hasCuriousUnavailableMessageDisplayed()
  })
})
