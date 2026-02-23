import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'
import EducationAndTrainingPage from '../../pages/overview/EducationAndTrainingPage'
import AuthSignInPage from '../../pages/authSignIn'

context('Prisoner Overview page - Common functionality for both pre and post induction', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsReadOnlyUser')
    cy.task('getPrisonerById')
    cy.task('stubLearnerAssessments')
    cy.task('stubLearnerQualifications')
    cy.task('stubGetInduction')
    cy.task('getActionPlan')
    cy.task('stubGetActionPlanReviews')
    cy.task('stubGetInductionSchedule')
    cy.task('stubMatchLearnerEvents')
    cy.task('stubGetEducation')
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

  it('should display sign in page given requesting the overview page for a prisoner not in the user caseloads', () => {
    // Given
    cy.signIn()
    // The signed in and stubbed user is John Smith whose active caseload ID is BXI

    const prisonNumberForPrisonerInDifferentPrison = 'A9404DY' // Prisoner A9404DY is in prison PVI

    // When
    cy.visit(`/plan/${prisonNumberForPrisonerInDifferentPrison}/view/overview`)

    // Then
    Page.verifyOnPage(AuthSignInPage)
  })

  describe('Goals summary card', () => {
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
        .hasLastUpdatedHint('Last updated 22 August 2023 by George Costanza, Moorland (HMP & YOI)')
    })
  })

  describe('Sessions history summary card', () => {
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
      cy.task('stubGetActionPlanReviews404Error')

      // When
      cy.visit(`/plan/${prisonNumber}/view/overview`)

      // Then
      const overviewPage = Page.verifyOnPage(OverviewPage)
      overviewPage //
        .isForPrisoner(prisonNumber)
        .activeTabIs('Overview')
        .hasNumberOfActionPlanReviews(1)
    })
  })

  describe('Education and training summary card', () => {
    it('should display functional skills and all qualification counts given in-prison courses completed in the last 12 months', () => {
      // Given
      cy.signIn()
      cy.task('stubLearnerAssessments')
      cy.task('stubLearnerQualificationsWithCompletedCoursesInLast12Months')
      cy.task('stubMatchLearnerEvents')
      cy.task('stubGetEducation')

      // When
      cy.visit(`/plan/${prisonNumber}/view/overview`)

      // Then
      const overviewPage = Page.verifyOnPage(OverviewPage)
      overviewPage //
        .isForPrisoner(prisonNumber)
        .activeTabIs('Overview')
        .hasFunctionalSkillsTableDisplayed()
        .lrsVerifiedQualificationsCountIs(3)
        .curiousInPrisonCourseCountIs(1)
        .lwpQualificationsCountIs(1)
        .educationAndTrainingSummaryCardApiErrorBannerIsNotDisplayed()
    })

    it('should display functional skills and all qualification counts given there are in-prison courses or qualifications but none completed in the last 12 months', () => {
      // Given
      cy.signIn()
      cy.task('stubLearnerAssessments')
      cy.task('stubLearnerQualificationsWithCompletedCoursesOlderThanLast12Months')
      cy.task('stubMatchLearnerEvents')
      cy.task('stubGetEducation')

      // When
      cy.visit(`/plan/${prisonNumber}/view/overview`)

      // Then
      const overviewPage = Page.verifyOnPage(OverviewPage)
      overviewPage //
        .isForPrisoner(prisonNumber)
        .activeTabIs('Overview')
        .hasFunctionalSkillsTableDisplayed()
        .lrsVerifiedQualificationsCountIs(3)
        .curiousInPrisonCourseCountIs(0)
        .lwpQualificationsCountIs(1)
        .educationAndTrainingSummaryCardApiErrorBannerIsNotDisplayed()
    })

    it('should display functional skills and all qualification counts given there are withdrawn or in progress in-prison courses or qualifications but no completed ones', () => {
      // Given
      cy.signIn()
      cy.task('stubLearnerAssessments')
      cy.task('stubLearnerQualificationsWithWithdrawnAndInProgressCourses')
      cy.task('stubMatchLearnerEvents')
      cy.task('stubGetEducation')

      // When
      cy.visit(`/plan/${prisonNumber}/view/overview`)

      // Then
      const overviewPage = Page.verifyOnPage(OverviewPage)
      overviewPage //
        .isForPrisoner(prisonNumber)
        .activeTabIs('Overview')
        .hasFunctionalSkillsTableDisplayed()
        .lrsVerifiedQualificationsCountIs(3)
        .curiousInPrisonCourseCountIs(0)
        .lwpQualificationsCountIs(1)
        .educationAndTrainingSummaryCardApiErrorBannerIsNotDisplayed()
    })

    it('should display functional skills and all qualification counts given there are no in-prison courses or qualifications recorded at all', () => {
      // Given
      cy.signIn()
      cy.task('stubLearnerAssessments')
      cy.task('stubLearnerQualificationsWithNoCourses')
      cy.task('stubMatchLearnerEvents')
      cy.task('stubGetEducation')

      // When
      cy.visit(`/plan/${prisonNumber}/view/overview`)

      // Then
      const overviewPage = Page.verifyOnPage(OverviewPage)
      overviewPage //
        .isForPrisoner(prisonNumber)
        .activeTabIs('Overview')
        .hasFunctionalSkillsTableDisplayed()
        .lrsVerifiedQualificationsCountIs(3)
        .curiousInPrisonCourseCountIs(0)
        .lwpQualificationsCountIs(1)
        .educationAndTrainingSummaryCardApiErrorBannerIsNotDisplayed()
    })

    it('should display Curious unavailable message given Curious errors when getting Functional Skills', () => {
      // Given
      cy.signIn()
      cy.task('stubLearnerAssessments500Error')

      // When
      cy.visit(`/plan/${prisonNumber}/view/overview`)

      // Then
      const overviewPage = Page.verifyOnPage(OverviewPage)
      overviewPage //
        .isForPrisoner(prisonNumber)
        .activeTabIs('Overview')
        .hasNoFunctionalSkillsTableDisplayed()
        .hasCuriousFunctionalSkillsUnavailableMessageDisplayed()
        .educationAndTrainingSummaryCardApiErrorBannerIsDisplayed()
    })

    it('should display Curious In Prison Course unavailable message given Curious errors when getting In Prison Courses', () => {
      // Given
      cy.signIn()
      cy.task('stubLearnerQualifications500Error')

      // When
      cy.visit(`/plan/${prisonNumber}/view/overview`)

      // Then
      const overviewPage = Page.verifyOnPage(OverviewPage)
      overviewPage //
        .isForPrisoner(prisonNumber)
        .activeTabIs('Overview')
        .curiousInPrisonCourseCountUnavailable()
        .educationAndTrainingSummaryCardApiErrorBannerIsDisplayed()
    })

    it('should display LRS Qualifications unavailable message given LRS errors when getting LRS Qualifications', () => {
      // Given
      cy.signIn()
      cy.task('stubMatchLearnerEvents500Error')

      // When
      cy.visit(`/plan/${prisonNumber}/view/overview`)

      // Then
      const overviewPage = Page.verifyOnPage(OverviewPage)
      overviewPage //
        .isForPrisoner(prisonNumber)
        .activeTabIs('Overview')
        .lrsVerifiedQualificationsCountUnavailable()
        .educationAndTrainingSummaryCardApiErrorBannerIsDisplayed()
    })

    it('should display LWP Qualifications unavailable message given LWP errors when getting LWP Qualifications', () => {
      // Given
      cy.signIn()
      cy.task('stubGetEducation500Error')

      // When
      cy.visit(`/plan/${prisonNumber}/view/overview`)

      // Then
      const overviewPage = Page.verifyOnPage(OverviewPage)
      overviewPage //
        .isForPrisoner(prisonNumber)
        .activeTabIs('Overview')
        .lwpQualificationsCountUnavailable()
        .educationAndTrainingSummaryCardApiErrorBannerIsDisplayed()
    })
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
        cy.task('stubSignInAsUserWithManagerRole')
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

      it('should display Actions Card containing no Reviews based actions given user has editor access and prisoner has no Review Schedule', () => {
        // Given
        cy.task('stubSignInAsUserWithManagerRole')
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
      cy.task('stubLearnerAssessmentsConnectionTimeoutError')
      cy.task('stubLearnerQualificationsConnectionTimeoutError')

      // When
      cy.visit(`/plan/${prisonNumber}/view/overview`)

      // Then
      const overviewPage = Page.verifyOnPage(OverviewPage)
      overviewPage //
        .isForPrisoner(prisonNumber)
        .activeTabIs('Overview')
        .hasNoFunctionalSkillsTableDisplayed()
        .hasCuriousFunctionalSkillsUnavailableMessageDisplayed()
        .curiousInPrisonCourseCountUnavailable()
        .educationAndTrainingSummaryCardApiErrorBannerIsDisplayed()
    })
  })
})
