import Page from '../../pages/page'
import AddStepPage from '../../pages/goal/AddStepPage'
import AddNotePage from '../../pages/goal/AddNotePage'
import ReviewPage from '../../pages/goal/ReviewPage'
import OverviewPage from '../../pages/overview/OverviewPage'

context('Review goal(s)', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('getPrisonerById', 'G6115VJ')
    cy.task('getPrisonerById', 'H4115SD')
    cy.task('getActionPlan', 'G6115VJ')
    cy.task('getActionPlan', 'H4115SD')
    cy.task('stubLearnerProfile', 'G6115VJ')
    cy.task('stubLearnerProfile', 'H4115SD')
    cy.task('stubLearnerEducation', 'G6115VJ')
    cy.task('stubLearnerEducation', 'H4115SD')
    cy.task('createGoal')
  })

  it('should not be able to navigate directly to Review Goal given previous forms have not been submitted', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/review`)

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
    Page.verifyOnPage(ReviewPage)

    const someOtherPrisonNumber = 'H4115SD'

    // When
    cy.visit(`/plan/${someOtherPrisonNumber}/goals/review`)

    // Then
    overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.isForPrisoner(someOtherPrisonNumber)
  })

  it('should not be able to navigate directly to Review Goal given Create Goal and Add Steps have been submitted but Add Note has not', () => {
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

  it('should move to Overview page', () => {
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    let overviewPage = Page.verifyOnPage(OverviewPage)

    const createGoalPage = overviewPage.clickAddGoalButton()
    createGoalPage.setGoalTitle('Learn French')
    createGoalPage.submitPage()

    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .setStepTitle('Book French course')
      .setStepTargetDateRange('ZERO_TO_THREE_MONTHS')
    addStepPage.submitPage()

    const addNotePage = Page.verifyOnPage(AddNotePage)
    addNotePage.setNote("Pay close attention to Chris' behaviour during classes")
    addNotePage.submitPage()

    const reviewPage = Page.verifyOnPage(ReviewPage)
    reviewPage //
      .isForPrisoner(prisonNumber)

    // When
    reviewPage.submitPage()

    // Then
    overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
  })
})
