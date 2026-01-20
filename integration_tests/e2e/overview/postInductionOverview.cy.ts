import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'

context('Prisoner Overview page - Post Induction', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('getPrisonerById')
    cy.task('stubGetInduction')
    cy.task('stubLearnerAssessments')
    cy.task('stubLearnerQualifications')
    cy.task('getActionPlan')
  })

  const prisonNumber = 'G6115VJ'

  it('should render prisoner Overview page without Create Induction panel', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPostInduction()
  })
})
