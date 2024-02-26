import Page from '../../pages/page'
import AddStepPage from '../../pages/goal/AddStepPage'
import AddNotePage from '../../pages/goal/AddNotePage'
import ReviewPage from '../../pages/goal/ReviewPage'
import OverviewPage from '../../pages/overview/OverviewPage'
import CreateGoalPage from '../../pages/goal/CreateGoalPage'

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
    cy.task('stubGetInductionShortQuestionSet')
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
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

    const today = new Date()
    const nextYear = new Date(
      today.getTime() +
        365 * // days
          24 * // hours
          60 * // minutes
          60 * // seconds
          1000, // milliseconds
    )
    const targetCompletionDay = `${nextYear.getDate()}`
    const targetCompletionMonth = `${nextYear.getMonth() + 1}` // month is zero indexed so need to add 1
    const targetCompletionYear = `${nextYear.getFullYear()}`
    const expectedMonthName = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ][nextYear.getMonth()]

    const editGoalPage = Page.verifyOnPage(CreateGoalPage)
    editGoalPage.setTargetCompletionDate(targetCompletionDay, targetCompletionMonth, targetCompletionYear)
    editGoalPage.submitPage()

    // Then
    Page.verifyOnPage(ReviewPage)
    reviewPage.hasGoalTargetDate(`by ${targetCompletionDay} ${expectedMonthName} ${targetCompletionYear}`)
  })
})
