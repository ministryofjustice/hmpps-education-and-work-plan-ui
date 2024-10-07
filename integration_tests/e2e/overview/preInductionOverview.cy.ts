import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'

context('Prisoner Overview page - Pre Induction', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('stubPrisonerList')
    cy.task('getPrisonerById')
    cy.task('stubGetInduction')
    cy.task('getActionPlan')
  })

  const prisonNumber = 'G6115VJ'

  it('should render prisoner Overview page with Create Induction panel', () => {
    // Given
    cy.signIn()
    cy.task('stubGetInduction404Error')

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPreInduction()
  })
})
