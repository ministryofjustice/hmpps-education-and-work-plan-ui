import Page from '../../pages/page'
import AuthorisationErrorPage from '../../pages/authorisationError'
import FunctionalSkillsPage from '../../pages/functionalSkills/FunctionalSkillsPage'
import EducationAndTrainingPage from '../../pages/overview/EducationAndTrainingPage'
import OverviewPage from '../../pages/overview/OverviewPage'

context(`Display a prisoner's functional skills`, () => {
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
    cy.task('stubGetInduction')
  })

  it('should be able to navigate directly to the Functional Skills page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/functional-skills`)

    // Then
    const functionalSkillsPage = Page.verifyOnPage(FunctionalSkillsPage)
    functionalSkillsPage
      .isForPrisoner(prisonNumber)
      .hasMathsFunctionalSkillsDisplayed()
      .hasDigitalFunctionalSkillsDisplayed()
  })

  it('should go to Education and Training tab when clicking learning plan breadcrumb on Functional Skills page', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()

    cy.visit(`/plan/${prisonNumber}/functional-skills`)
    const functionalSkillsPage = Page.verifyOnPage(FunctionalSkillsPage)

    // When
    const educationAndTrainingPage = functionalSkillsPage.clickLearningPlanBreadcrumb()

    // Then
    educationAndTrainingPage.activeTabIs('Education and training')
  })

  it('should display curious unavailable message given curious is unavailable for the learner profile', () => {
    // Given
    cy.task('stubLearnerProfile401Error')
    cy.task('stubLearnerEducation')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.selectTab('Education and training')
    const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

    // When
    const functionalSkillsPage = educationAndTrainingPage.clickToViewAllFunctionalSkills()

    // Then
    functionalSkillsPage
      .isForPrisoner(prisonNumber)
      .doesNotHaveEnglishFunctionalSkillsDisplayed()
      .doesNotHaveMathsFunctionalSkillsDisplayed()
      .doesNotHaveDigitalFunctionalSkillsDisplayed()
      .hasCuriousUnavailableMessageDisplayed()
  })

  it('should redirect to auth-error page given user does not have any authorities', () => {
    // Given
    cy.task('stubSignIn')

    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/functional-skills`, { failOnStatusCode: false })

    // Then
    Page.verifyOnPage(AuthorisationErrorPage)
  })
})
