import Page from '../../pages/page'
import FunctionalSkillsPage from '../../pages/functionalSkills/FunctionalSkillsPage'
import EducationAndTrainingPage from '../../pages/overview/EducationAndTrainingPage'
import OverviewPage from '../../pages/overview/OverviewPage'

context(`Display a prisoner's functional skills`, () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsReadOnlyUser')
    cy.task('stubGetAllPrisons')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('getActionPlan')
    cy.task('stubLearnerAssessments')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerQualifications')
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
    cy.task('stubLearnerQualifications')

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

  it('should display curious unavailable message given curious is unavailable for the learner assessnents', () => {
    // Given
    cy.task('stubLearnerAssessments500Error')
    cy.task('stubLearnerQualifications')

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
})
