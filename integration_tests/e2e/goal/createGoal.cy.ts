import Page from '../../pages/page'
import CreateGoalPage from '../../pages/goal/CreateGoalPage'

context('Create a goal', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById')
  })

  it('should render initial create goal page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    // Then
    const page = Page.verifyOnPage(CreateGoalPage)
    page.isForPrisoner(prisonNumber)
  })

  it.skip('should move to add step page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    const page = Page.verifyOnPage(CreateGoalPage)
    page.setGoalTitle('Learn French')
    page.setGoalReviewDate(23, 12, 2024)

    // When
    page.submitPage()

    // Then
    // assert we are on the next page
  })
})
