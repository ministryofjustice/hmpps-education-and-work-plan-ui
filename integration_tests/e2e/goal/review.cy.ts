import Page from '../../pages/page'
import CreateGoalPage from '../../pages/goal/CreateGoalPage'
import AddStepPage from '../../pages/goal/AddStepPage'
import AddNotePage from '../../pages/goal/AddNotePage'
import ReviewPage from '../../pages/goal/ReviewPage'
import OverviewPage from '../../pages/overview/OverviewPage'

context('Review goal(s)', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('getPrisonerById', 'G6115VJ')
    cy.task('getPrisonerById', 'H4115SD')
  })

  it('should not be able to navigate directly to Review Goal given previous forms have not been submitted', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/add-note`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.isForPrisoner(prisonNumber)
  })

  it('should not be able to arrive on Review Goal page, then change the prison number in the URL', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    let overviewPage = Page.verifyOnPage(OverviewPage)

    const createGoalPage = overviewPage.clickAddGoalButton()
    createGoalPage //
      .setGoalTitle('Learn French')
      .submitPage()

    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .setStepTitle('Book French course')
      .setStepTargetDateRange('ZERO_TO_THREE_MONTHS')
      .submitPage()

    const addNotePage = Page.verifyOnPage(AddNotePage)
    addNotePage //
      .isForPrisoner(prisonNumber)
      .submitPage()

    const someOtherPrisonNumber = 'H4115SD'

    // When
    cy.visit(`/plan/${someOtherPrisonNumber}/goals/review`)

    // Then
    overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.isForPrisoner(someOtherPrisonNumber)
  })

  it('should not be able to navigate directly to review goal given Create Goal and Add Steps have been submitted but Add Note has not', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    const createGoalPage = overviewPage.clickAddGoalButton()
    createGoalPage //
      .setGoalTitle('Learn French')
      .submitPage()

    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .setStepTitle('Book French course')
      .setStepTargetDateRange('ZERO_TO_THREE_MONTHS')
      .submitPage()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/review`)

    // Then
    Page.verifyOnPage(AddNotePage)
  })

  it.skip('should move to overview page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    const createGoalPage = Page.verifyOnPage(CreateGoalPage)
    createGoalPage //
      .setGoalTitle('Learn French')
      .submitPage()

    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .setStepTitle('Book French course')
      .setStepTargetDateRange('ZERO_TO_THREE_MONTHS')
    addStepPage.submitPage()

    const addNotePage = Page.verifyOnPage(AddNotePage)
    addNotePage.setNote("Pay close attention to Chris' behaviour during classes")
    addNotePage.submitPage()

    const reviewPage = Page.verifyOnPage(ReviewPage)

    // When
    reviewPage.submitPage()

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
  })
})
