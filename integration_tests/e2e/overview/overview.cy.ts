import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'
import Error404Page from '../../pages/error404'

context('Prisoner Overview page - Common functionality for both pre and post induction', () => {
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
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('stubGetInductionShortQuestionSet')
    cy.task('stubGetAllPrisons')
  })

  it('should have the DPS breadcrumb which does not include the current page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // Check
    overviewPage.hasBreadcrumb().breadcrumbDoesNotIncludeCurrentPage()
  })

  it('should have the DPS footer', () => {
    // Given
    const prisonNumber = 'G6115VJ'

    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // Check
    overviewPage.hasFooter()
  })

  it('should have the standard footer given the DPS frontend component API errors', () => {
    cy.task('stubGetFooterComponent500error')
    // Given
    const prisonNumber = 'G6115VJ'

    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // Check
    overviewPage.hasFallbackFooter()
  })

  it('should display functional skills and most recent qualifications in the sidebar', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .activeTabIs('Overview')
      .hasFunctionalSkillsSidebar()
      .hasMostRecentQualificationsSidebar()
  })

  it('should display Curious unavailable message in the functional skills sidebar given Curious errors when getting Functional Skills', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.task('stubLearnerProfile401Error')

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .activeTabIs('Overview')
      .hasCuriousUnavailableMessageInFunctionalSkillsSidebar()
      .hasMostRecentQualificationsSidebar()
  })

  it('should display Curious unavailable message in the most recent qualifications sidebar given Curious errors when getting Most Recent Qualifications', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.task('stubLearnerEducation401Error')

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .activeTabIs('Overview')
      .hasFunctionalSkillsSidebar()
      .hasCuriousUnavailableMessageInMostRecentQualificationsSidebar()
  })

  it(`should render 404 page given specified prisoner is not found`, () => {
    // Given
    const nonExistentPrisonNumber = 'A9999ZZ'
    cy.signIn()
    cy.task('stubPrisonerById404Error', nonExistentPrisonNumber)

    // When
    cy.visit(`/plan/${nonExistentPrisonNumber}/view/overview`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(Error404Page)
  })
})
