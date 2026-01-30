import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'
import EmployabilitySkillsPage from '../../pages/overview/EmployabilitySkillsPage'

context('Prisoner Overview page - Employability Skills tab', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsReadOnlyUser')
    cy.task('getPrisonerById')
    cy.task('stubLearnerAssessments')
    cy.task('stubLearnerQualifications')
    cy.task('stubGetInduction')
    cy.task('getActionPlan')
    cy.task('stubGetAllPrisons')
    cy.task('stubGetConditions')
    cy.task('stubGetSupportStrategies')
    cy.task('stubGetChallenges')
    cy.task('stubGetStrengths')
    cy.task('stubGetAlnScreeners')
    cy.signIn()
  })

  it('should display Employability Skills tab', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Employability skills')

    // Then
    Page.verifyOnPage(EmployabilitySkillsPage)
  })
})
