import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'

context('Prisoner Overview page - Education And Training tab', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('stubPrisonerList')
    cy.task('getPrisonerById')
    cy.task('getActionPlan')
  })

  it('should display Education and Training data', () => {
    // Given
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Education and training')

    // Then
    overviewPage //
      .activeTabIs('Education and training')
      .hasFunctionalSkillsDisplayed()
      .hasCompletedInPrisonQualificationsDisplayed()
  })

  it('should display Education and Training data given curious API returns a 404 for the learner profile', () => {
    // Given
    cy.task('stubLearnerProfile404Error')
    cy.task('stubLearnerEducation')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Education and training')

    // Then
    overviewPage //
      .activeTabIs('Education and training')
      .hasFunctionalSkillsDisplayed()
      .hasCompletedInPrisonQualificationsDisplayed()
  })

  it('should display Education and Training data given curious API returns a 404 for the learner education', () => {
    // Given
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation404Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Education and training')

    // Then
    overviewPage //
      .activeTabIs('Education and training')
      .hasFunctionalSkillsDisplayed()
      .hasCompletedInPrisonQualificationsDisplayed()
  })

  it('should display curious unavailable message given curious is unavailable for the learner profile', () => {
    // Given
    cy.task('stubLearnerProfile401Error')
    cy.task('stubLearnerEducation')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Education and training')

    // Then
    overviewPage //
      .activeTabIs('Education and training')
      .doesNotHaveFunctionalSkillsDisplayed()
      .hasCuriousUnavailableMessageDisplayed()
      .hasCompletedInPrisonQualificationsDisplayed()
  })

  it('should display curious unavailable message given curious is unavailable for the learner education', () => {
    // Given
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation401Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Education and training')

    // Then
    overviewPage //
      .activeTabIs('Education and training')
      .hasFunctionalSkillsDisplayed()
      .doesNotCompletedInPrisonQualificationsDisplayed()
      .hasCuriousUnavailableMessageDisplayed()
  })
})
