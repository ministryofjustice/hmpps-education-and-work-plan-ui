import Page from '../../pages/page'
import CreateGoalPage from '../../pages/goal/CreateGoalPage'
import AddStepPage from '../../pages/goal/AddStepPage'
import AuthorisationErrorPage from '../../pages/authorisationError'
import OverviewPage from '../../pages/overview/OverviewPage'

context('Create a goal', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('stubPrisonerList')
    cy.task('getPrisonerById')
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
  })

  it('should be able to navigate to Create Goal page given user has clicked Add A Goal from Overview page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    const createGoalPage = overviewPage.clickAddGoalButton()

    // Then
    createGoalPage.isForPrisoner(prisonNumber)
  })

  it('should be able to navigate directly to Create Goal page from non-PLP pages such as CIAG service', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    // Then
    const createGoalPage = Page.verifyOnPage(CreateGoalPage)
    createGoalPage.isForPrisoner(prisonNumber)
  })

  it('should not proceed to Add Step page given validation errors on Create Goal page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)
    const createGoalPage = overviewPage.clickAddGoalButton()

    createGoalPage //
      .clearGoalTitle()

    // When
    createGoalPage.submitPage()

    // Then
    Page.verifyOnPage(CreateGoalPage)
    createGoalPage //
      .hasErrorCount(1)
      .hasFieldInError('title')
  })

  it('should proceed to Add Step Page given no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)
    const createGoalPage = overviewPage.clickAddGoalButton()

    // When
    createGoalPage //
      .setGoalTitle('Learn French')
      .setTargetCompletionDate0to3Months()
      .submitPage()

    // Then
    Page.verifyOnPage(AddStepPage)
  })

  it('should proceed to Add Step Page given user has provided a custom date target completion date', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)
    const createGoalPage = overviewPage.clickAddGoalButton()

    // When
    createGoalPage //
      .setGoalTitle('Learn French')
      .setTargetCompletionDate('26', '02', '2028')
      .submitPage()

    // Then
    Page.verifyOnPage(AddStepPage)
  })

  it('should redirect to auth-error page given user does not have any authorities', () => {
    // Given
    cy.task('stubSignIn')

    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/create`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it('should redirect to auth-error page given user does not have edit authority', () => {
    // Given
    cy.task('stubSignInAsUserWithViewAuthority')

    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/create`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
