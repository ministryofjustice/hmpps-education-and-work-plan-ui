import Page from '../../pages/page'
import AddStepPage from '../../pages/goal/AddStepPage'
import AddNotePage from '../../pages/goal/AddNotePage'
import ReviewPage from '../../pages/goal/ReviewPage'
import OverviewPage from '../../pages/overview/OverviewPage'

context('Add and edit a step', () => {
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

  it('should be able to edit the step from the review goal screen', () => {
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
    let reviewPage = Page.verifyOnPage(ReviewPage)
    reviewPage.clickChangeGoalDescriptionLink()

    const editStepPage = Page.verifyOnPage(AddStepPage)
    editStepPage.setStepTitle('Read a French phrase book')
    editStepPage.submitPage()

    // Then
    reviewPage = Page.verifyOnPage(ReviewPage)
    reviewPage.hasStepDescription('Read a French phrase book')
  })
})
