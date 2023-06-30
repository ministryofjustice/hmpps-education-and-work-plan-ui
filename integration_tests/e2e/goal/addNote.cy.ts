import Page from '../../pages/page'
import CreateGoalPage from '../../pages/goal/CreateGoalPage'
import AddStepPage from '../../pages/goal/AddStepPage'
import AddNotePage from '../../pages/goal/AddNotePage'

context('Add a note', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach(() => {})

  it('should render add note page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/add-note`)

    // Then
    const page = Page.verifyOnPage(AddNotePage)
    page.isForPrisoner(prisonNumber)
  })

  it.skip('should move to review goals page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/create`)

    const createGoalPage = Page.verifyOnPage(CreateGoalPage)
    createGoalPage.setGoalTitle('Learn French')
    createGoalPage.setGoalReviewDate(23, 12, 2024)
    createGoalPage.submitPage()

    const addStepPage = Page.verifyOnPage(AddStepPage)
    addStepPage.setStepTitle('Book French course')
    addStepPage.setStepTargetDate(23, 12, 2024)
    addStepPage.submitPage()

    const addNotePage = Page.verifyOnPage(AddNotePage)
    addNotePage.setNote("Pay close attention to Chris' behaviour during classes")

    // When
    addNotePage.submitPage()

    // Then
    // assert we are on the next page
  })
})
