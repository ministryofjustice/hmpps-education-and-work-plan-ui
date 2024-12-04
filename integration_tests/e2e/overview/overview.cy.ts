import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'
import EducationAndTrainingPage from '../../pages/overview/EducationAndTrainingPage'
import Error404Page from '../../pages/error404'

context('Prisoner Overview page - Common functionality for both pre and post induction', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsReadOnlyUser')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('stubGetInduction')
    cy.task('stubGetAllPrisons')
    cy.task('getActionPlan')
    cy.task('stubGetActionPlanReviews')
  })

  const prisonNumber = 'G6115VJ'

  it('should have the DPS breadcrumb which does not include the current page', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // Check
    overviewPage.hasBreadcrumb().breadcrumbDoesNotIncludeCurrentPage()
  })

  it('should have the DPS footer', () => {
    // Given
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // Check
    overviewPage.hasFooter()
  })

  it('should have the standard footer given the DPS frontend component API errors', () => {
    cy.task('stubGetFooterComponent500error')
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // Check
    overviewPage.hasFallbackFooter()
  })

  it('should display correct counts of in progress and archived goals', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .activeTabIs('Overview')
      .hasNumberOfInProgressGoals(1)
      .hasNumberOfArchivedGoals(2)
  })

  it('should display correct action plan review count', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .activeTabIs('Overview')
      // If there is a session count it will always be at least 1 as the induction is included in the total
      .hasNumberOfActionPlanReviews(2)
  })

  it('should display count of 1 action plan reviews given there is an induction but there are no action plan reviews', () => {
    // Given
    cy.signIn()

    // When
    cy.task('stubGetActionPlanReviews404Error')
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .activeTabIs('Overview')
      .hasNumberOfActionPlanReviews(1)
  })

  it('should display correct hint text showing details from the most recently updated goal', () => {
    // Given
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .activeTabIs('Overview')
      .hasLastUpdatedHint('Updated on 22 August 2023 by George Costanza, Moorland (HMP & YOI)')
  })

  it('should display courses if completed in the last 12 months', () => {
    // Given
    cy.signIn()

    // When
    cy.task('stubLearnerEducationWithCompletedCoursesInLast12Months')
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .activeTabIs('Overview')
      .hasCourseCompletedInLast12Months('GCSE Maths')
      .hasViewAllEducationAndTrainingButtonDisplayed()
  })

  it('should display the correct message if there are courses or qualifications but none completed in the last 12 months', () => {
    // Given
    cy.signIn()

    // When
    cy.task('stubLearnerEducationWithCompletedCoursesOlderThanLast12Months')
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .activeTabIs('Overview')
      .hasNoCoursesTableDisplayed()
      .hasViewAllEducationAndTrainingButtonDisplayed()
  })

  it('should display the correct message if there are withdrawn or in progress courses or qualifications but no completed ones', () => {
    // Given
    cy.signIn()

    // When
    cy.task('stubLearnerEducationWithWithdrawnAndInProgressCourses')
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .activeTabIs('Overview')
      .hasNoCoursesTableDisplayed()
      .hasNoCoursesCompletedYetMessageDisplayed()
  })

  it('should display the correct message if there are no courses or qualifications recorded at all', () => {
    // Given
    cy.signIn()

    // When
    cy.task('stubLearnerEducationWithNoCourses')
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .activeTabIs('Overview')
      .hasNoCoursesTableDisplayed()
      .hasNoCoursesRecordedMessageDisplayed()
  })

  it('should display Curious unavailable message given Curious errors when getting Functional Skills', () => {
    // Given
    cy.signIn()

    // When
    cy.task('stubLearnerProfile401Error')
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .activeTabIs('Overview')
      .hasNoFunctionalSkillsTableDisplayed()
      .hasCuriousUnavailableMessageDisplayed()
  })

  it('should display Curious unavailable message given Curious errors when getting Most Recent Qualifications', () => {
    // Given
    cy.signIn()

    // When
    cy.task('stubLearnerEducation401Error')
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .activeTabIs('Overview')
      .hasNoCoursesTableDisplayed()
      .hasCuriousUnavailableMessageDisplayed()
  })

  it('should be able to navigate to the Education and Training page from the link on the Overview page', () => {
    // Given
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.clickToViewAllEducationAndTraining()

    // Then
    Page.verifyOnPage(EducationAndTrainingPage)
  })

  it('should not display a prisoners overview if they are in a different prison to the users caseload', () => {
    // Given
    cy.signIn()
    // The signed in and stubbed user is John Smith whose active caseload ID is BXI

    const prisonNumberForPrisonerInDifferentPrison = 'A9404DY' // Prisoner A9404DY is in prison PVI

    // When
    cy.visit(`/plan/${prisonNumberForPrisonerInDifferentPrison}/view/overview`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  describe('Actions Card', () => {
    it('should not display Actions Card given user is a read only user', () => {
      // Given
      cy.task('stubSignInAsReadOnlyUser')
      cy.signIn()

      // When
      cy.visit(`/plan/${prisonNumber}/view/overview`)

      // Then
      Page.verifyOnPage(OverviewPage) //
        .activeTabIs('Overview')
        .actionsCardIsNotPresent()
    })

    describe('Reviews', () => {
      it('should display Actions Card containing Reviews based actions given user has editor access and prisoner has a Review Schedule', () => {
        // Given
        cy.task('stubSignInAsUserWithEditAuthority')
        cy.task('stubGetActionPlanReviews')
        cy.signIn()

        // When
        cy.visit(`/plan/${prisonNumber}/view/overview`)

        // Then
        Page.verifyOnPage(OverviewPage) //
          .activeTabIs('Overview')
          .actionsCardContainsGoalsActions()
          .actionsCardContainsReviewsActions()
      })

      it('should display Actions Card without Reviews based actions given user has editor access and prisoner has no Review Schedule', () => {
        // Given
        cy.task('stubSignInAsUserWithEditAuthority')
        cy.task('stubGetActionPlanReviews404Error')
        cy.signIn()

        // When
        cy.visit(`/plan/${prisonNumber}/view/overview`)

        // Then
        Page.verifyOnPage(OverviewPage) //
          .activeTabIs('Overview')
          .actionsCardContainsGoalsActions()
          .actionsCardDoesNotContainReviewsActions()
      })
    })
  })

  describe('API timeout tests - these are slow tests!', () => {
    it('should display Curious unavailable message given Curious has timeout errors when getting Functional Skills and In Prison Courses', () => {
      // Given
      cy.signIn()
      cy.task('stubLearnerProfileConnectionTimeoutError')
      cy.task('stubLearnerEducationConnectionTimeoutError')

      // When
      cy.visit(`/plan/${prisonNumber}/view/overview`)

      // Then
      const overviewPage = Page.verifyOnPage(OverviewPage)
      overviewPage //
        .isForPrisoner(prisonNumber)
        .activeTabIs('Overview')
        .hasNoFunctionalSkillsTableDisplayed()
        .hasNoCoursesTableDisplayed()
        .hasCuriousUnavailableMessageDisplayed()
    })
  })
})
