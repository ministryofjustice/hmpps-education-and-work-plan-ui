import Page from '../../pages/page'
import ArchiveGoalPage from '../../pages/goal/ArchiveGoalPage'
import ReasonToArchiveGoalValue from '../../../server/enums/ReasonToArchiveGoalValue'
import ReviewArchiveGoalPage from '../../pages/goal/ReviewArchiveGoalPage'
import OverviewPage from '../../pages/overview/OverviewPage'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context('Archive a goal', () => {
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
    cy.task('stubGetInduction')
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('archiveGoal')
  })

  it('should be able to navigate directly to archive goal page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/archive`)

    // Then
    const archiveGoalPage = Page.verifyOnPage(ArchiveGoalPage)
    archiveGoalPage.isForGoal(goalReference)
  })

  it('should be able to navigate to archive goal page from overview', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.clickArchiveButtonForFirstGoal()

    // Then
    Page.verifyOnPage(ArchiveGoalPage)
  })

  it('should not submit the form if there are validation errors on the page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/archive`)

    // When
    const archiveGoalPage = Page.verifyOnPage(ArchiveGoalPage)
    archiveGoalPage.submitPage()

    // Then
    Page.verifyOnPage(ArchiveGoalPage)
    archiveGoalPage //
      .hasErrorCount(1)
      .hasFieldInError('reason')
  })

  it('should not submit the form if other reason not entered', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/archive`)

    // When
    const archiveGoalPage = Page.verifyOnPage(ArchiveGoalPage)
    archiveGoalPage //
      .selectReason(ReasonToArchiveGoalValue.OTHER)
      .submitPage()

    // Then
    Page.verifyOnPage(ArchiveGoalPage)
    archiveGoalPage //
      .hasErrorCount(1)
      .hasFieldInError('reasonOther')
  })

  it('should show a hint for the number of characters remaining', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/archive`)

    // When
    const archiveGoalPage = Page.verifyOnPage(ArchiveGoalPage)
    archiveGoalPage //
      .selectReason(ReasonToArchiveGoalValue.OTHER)
      .enterReason(''.padEnd(150, 'x'))
      .shouldHaveOtherReasonHint('You have 50 characters remaining')

    // now make it too long
    archiveGoalPage //
      .enterReason(''.padEnd(100, 'x'))
      .shouldHaveOtherReasonHint('You have 50 characters too many')
      .submitPage()

    // Then
    Page.verifyOnPage(ArchiveGoalPage)
    archiveGoalPage //
      .hasErrorCount(1)
      .hasFieldInError('reasonOther')
  })

  it('should ask for confirmation and return to overview if choosing no', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/archive`)
    const archiveGoalPage = Page.verifyOnPage(ArchiveGoalPage)
    archiveGoalPage //
      .selectReason(ReasonToArchiveGoalValue.OTHER)
      .enterReason('Just because...')
      .submitPage()

    // When
    const reviewPage = Page.verifyOnPage(ReviewArchiveGoalPage)
    reviewPage.clickNo()

    // Then
    Page.verifyOnPage(OverviewPage)
    cy.wiremockVerifyNoInteractions(
      putRequestedFor(urlEqualTo(`/action-plans/${prisonNumber}/goals/${goalReference}/archive`)),
    )
  })

  it('should ask for confirmation and archive the goal then return to overview if choosing yes', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    const goalReference = '10efc562-be8f-4675-9283-9ede0c19dade'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/goals/${goalReference}/archive`)
    const archiveGoalPage = Page.verifyOnPage(ArchiveGoalPage)
    archiveGoalPage //
      .selectReason(ReasonToArchiveGoalValue.OTHER)
      .enterReason('Just because...')
      .submitPage()

    // When
    const reviewPage = Page.verifyOnPage(ReviewArchiveGoalPage)
    reviewPage.clickYes()

    // Then
    Page.verifyOnPage(OverviewPage) //
      .hasSuccessMessage('Goal archived')
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/action-plans/${prisonNumber}/goals/${goalReference}/archive`)) //
        .withRequestBody(
          matchingJsonPath(
            `$[?(@.goalReference == '${goalReference}' && @.reason == 'OTHER' && @.reasonOther == 'Just because...')]`,
          ),
        ),
    )
  })
})
