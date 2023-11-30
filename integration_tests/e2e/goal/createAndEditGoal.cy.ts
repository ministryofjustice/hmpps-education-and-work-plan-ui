import Page from '../../pages/page'
import AddStepPage from '../../pages/goal/AddStepPage'
import AddNotePage from '../../pages/goal/AddNotePage'
import ReviewPage from '../../pages/goal/ReviewPage'
import OverviewPage from '../../pages/overview/OverviewPage'
import CreateGoalPage from '../../pages/goal/CreateGoalPage'
import AuthorisationErrorPage from '../../pages/authorisationError'

context('Create and edit a goal', () => {
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
    cy.task('stubGetShortQuestionSetCiagProfile')
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
  })

  it('should be able to navigate to edit goal description page given user has clicked change from the review page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    const createGoalPage = overviewPage.clickAddGoalButton()
    createGoalPage //
      .setGoalTitle('Learn French')
      .setTargetCompletionDate0to3Months()
      .submitPage()

    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .setStepTitle('Book French course')
      .submitPage()

    const addNotePage = Page.verifyOnPage(AddNotePage)
    addNotePage.setNote("Pay close attention to Chris' behaviour during classes")
    addNotePage.submitPage()

    // When
    const reviewPage = Page.verifyOnPage(ReviewPage)
    reviewPage.clickChangeGoalDescriptionLink()

    // Then
    Page.verifyOnPage(CreateGoalPage)
  })

  it('should be able to navigate to edit goal target date page given user has clicked change from the review page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    const createGoalPage = overviewPage.clickAddGoalButton()
    createGoalPage //
      .setGoalTitle('Learn French')
      .setTargetCompletionDate0to3Months()
      .submitPage()

    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .setStepTitle('Book French course')
      .submitPage()

    const addNotePage = Page.verifyOnPage(AddNotePage)
    addNotePage.setNote("Pay close attention to Chris' behaviour during classes")
    addNotePage.submitPage()

    // When
    const reviewPage = Page.verifyOnPage(ReviewPage)
    reviewPage.clickChangeGoalTargetDateLink()

    // Then
    Page.verifyOnPage(CreateGoalPage)
  })

  it('should be able to edit the goal description from the review goal screen', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    const createGoalPage = overviewPage.clickAddGoalButton()
    createGoalPage //
      .setGoalTitle('Learn French')
      .setTargetCompletionDate0to3Months()
      .submitPage()

    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .setStepTitle('Book French course')
      .submitPage()

    const addNotePage = Page.verifyOnPage(AddNotePage)
    addNotePage.setNote("Pay close attention to Chris' behaviour during classes")
    addNotePage.submitPage()

    // When
    const reviewPage = Page.verifyOnPage(ReviewPage)
    reviewPage.clickChangeGoalDescriptionLink()

    const editGoalPage = Page.verifyOnPage(CreateGoalPage)
    editGoalPage.setGoalTitle('Learn Spanish')
    editGoalPage.submitPage()

    // Then
    Page.verifyOnPage(ReviewPage)
    reviewPage.hasGoalDescription('Learn Spanish')
  })

  it('should be able to edit the goal target date from the review goal screen', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    const createGoalPage = overviewPage.clickAddGoalButton()
    createGoalPage //
      .setGoalTitle('Learn French')
      .setTargetCompletionDate0to3Months()
      .submitPage()

    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage //
      .setStepTitle('Book French course')
      .submitPage()

    const addNotePage = Page.verifyOnPage(AddNotePage)
    addNotePage.setNote("Pay close attention to Chris' behaviour during classes")
    addNotePage.submitPage()

    // When
    const reviewPage = Page.verifyOnPage(ReviewPage)
    reviewPage.clickChangeGoalTargetDateLink()

    const editGoalPage = Page.verifyOnPage(CreateGoalPage)
    editGoalPage.setTargetCompletionDate('26', '2', '2024')
    editGoalPage.submitPage()

    // Then
    Page.verifyOnPage(ReviewPage)
    reviewPage.hasGoalTargetDate('by 26 February 2024')
  })

  it('should redirect to auth-error page given user does not have any authorities', () => {
    // Given
    cy.task('stubSignIn')

    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/1/create?edit`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })

  it('should redirect to auth-error page given user does not have edit authority', () => {
    // Given
    cy.task('stubSignInAsUserWithViewAuthority')

    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/1/create?edit`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
