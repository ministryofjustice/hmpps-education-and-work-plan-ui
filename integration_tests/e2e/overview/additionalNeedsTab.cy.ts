import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'
import AdditionalNeedsPage from '../../pages/overview/AdditionalNeedsPage'

context('Prisoner Overview page - Additional Needs tab', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsReadOnlyUser')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('stubLearnerAssessments')
    cy.task('stubLearnerQualifications')
    cy.task('stubGetInduction')
    cy.task('getActionPlan')
    cy.task('stubGetAllPrisons')
    cy.task('stubGetConditions')
    cy.task('stubGetSupportStrategies')
    cy.task('stubGetChallenges')
    cy.task('stubGetStrengths')
    cy.task('stubGetAlnScreeners')
  })

  it('should display Additional Needs data', () => {
    // Given
    cy.task('stubLearnerAssessments') // Curious assessments stub has 1 LDD and 1 ALN assessment
    cy.task('stubGetConditions') // Stub returns 1 Self Declared condition and 1 Confirmed condition
    cy.task('stubGetSupportStrategies')
    cy.task('stubGetChallenges')
    cy.task('stubGetStrengths')
    cy.task('stubGetAlnScreeners')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Additional needs')
    const additionalNeedsPage = Page.verifyOnPage(AdditionalNeedsPage)

    // Then
    additionalNeedsPage //
      .activeTabIs('Additional needs')
      .hasAlnAssessmentsDisplayed()
      .hasLddAssessmentsDisplayed()
      .hasStrengthsDisplayed()
      .hasChallengesDisplayed()
      .hasSupportStrategiesDisplayed()
      .hasSelfDeclaredConditionsDisplayed()
      .hasConfirmedDiagnosisConditionsDisplayed()
      .apiErrorBannerIsNotDisplayed()
  })

  it('should display no strengths message given ALN and strengths APIs return a 404', () => {
    // Given
    cy.task('stubGetAlnScreeners404Error')
    cy.task('stubGetStrengths404Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Additional needs')
    const additionalNeedsPage = Page.verifyOnPage(AdditionalNeedsPage)

    // Then
    additionalNeedsPage //
      .activeTabIs('Additional needs')
      .hasNoStrengthsMessageDisplayed()
      .apiErrorBannerIsNotDisplayed()
  })

  it('should display no challenges message given ALN and challenges APIs return a 404', () => {
    // Given
    cy.task('stubGetAlnScreeners404Error')
    cy.task('stubGetChallenges404Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Additional needs')
    const additionalNeedsPage = Page.verifyOnPage(AdditionalNeedsPage)

    // Then
    additionalNeedsPage //
      .activeTabIs('Additional needs')
      .hasNoChallengesMessageDisplayed()
      .apiErrorBannerIsNotDisplayed()
  })

  it('should display no conditions message given conditions API returns a 404', () => {
    // Given
    cy.task('stubGetConditions404Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Additional needs')
    const additionalNeedsPage = Page.verifyOnPage(AdditionalNeedsPage)

    // Then
    additionalNeedsPage //
      .activeTabIs('Additional needs')
      .hasNoConditionsMessageDisplayed()
      .apiErrorBannerIsNotDisplayed()
  })

  it('should display no support strategies message given support strategies API returns a 404', () => {
    // Given
    cy.task('stubGetSupportStrategies404Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Additional needs')
    const additionalNeedsPage = Page.verifyOnPage(AdditionalNeedsPage)

    // Then
    additionalNeedsPage //
      .activeTabIs('Additional needs')
      .hasNoSupportStrategiesMessageDisplayed()
      .apiErrorBannerIsNotDisplayed()
  })

  it('should display no results message given curious API returns a 404', () => {
    // Given
    cy.task('stubLearnerAssessments404Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Additional needs')
    const additionalNeedsPage = Page.verifyOnPage(AdditionalNeedsPage)

    // Then
    additionalNeedsPage //
      .activeTabIs('Additional needs')
      .hasNoAssessmentsMessageDisplayed()
      .apiErrorBannerIsNotDisplayed()
  })

  it('should display curious unavailable message given curious is unavailable', () => {
    // Given
    cy.task('stubLearnerAssessments500Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Additional needs')
    const additionalNeedsPage = Page.verifyOnPage(AdditionalNeedsPage)

    // Then
    additionalNeedsPage //
      .activeTabIs('Additional needs')
      .hasCuriousAssessmentsUnavailableMessageDisplayed()
      .apiErrorBannerIsDisplayed()
  })

  it('should display strengths unavailable message given strengths API is unavailable', () => {
    // Given
    cy.task('stubGetStrengths500Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Additional needs')
    const additionalNeedsPage = Page.verifyOnPage(AdditionalNeedsPage)

    // Then
    additionalNeedsPage //
      .activeTabIs('Additional needs')
      .hasStrengthsUnavailableMessageDisplayed()
      .apiErrorBannerIsDisplayed()
  })

  it('should display challenges unavailable message given challenges API is unavailable', () => {
    // Given
    cy.task('stubGetChallenges500Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Additional needs')
    const additionalNeedsPage = Page.verifyOnPage(AdditionalNeedsPage)

    // Then
    additionalNeedsPage //
      .activeTabIs('Additional needs')
      .hasChallengesUnavailableMessageDisplayed()
      .apiErrorBannerIsDisplayed()
  })

  it('should display conditions unavailable message given conditions API is unavailable', () => {
    // Given
    cy.task('stubGetConditions500Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Additional needs')
    const additionalNeedsPage = Page.verifyOnPage(AdditionalNeedsPage)

    // Then
    additionalNeedsPage //
      .activeTabIs('Additional needs')
      .hasConditionsUnavailableMessageDisplayed()
      .apiErrorBannerIsDisplayed()
  })

  it('should display support strategies unavailable message given support strategies API is unavailable', () => {
    // Given
    cy.task('stubGetSupportStrategies500Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Additional needs')
    const additionalNeedsPage = Page.verifyOnPage(AdditionalNeedsPage)

    // Then
    additionalNeedsPage //
      .activeTabIs('Additional needs')
      .hasSupportStrategiesUnavailableMessageDisplayed()
      .apiErrorBannerIsDisplayed()
  })
})
