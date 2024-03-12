import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'
import EducationAndTrainingPage from '../../pages/overview/EducationAndTrainingPage'
import InPrisonCoursesAndQualificationsPage from '../../pages/inPrisonCoursesAndQualifications/InPrisonCoursesAndQualificationsPage'
import InPrisonTrainingPage from '../../pages/induction/InPrisonTrainingPage'
import HighestLevelOfEducationPage from '../../pages/induction/HighestLevelOfEducationPage'

context('Prisoner Overview page - Education And Training tab', () => {
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
    cy.task('stubGetInductionLongQuestionSet')
  })

  describe('should retrieve and render data from Curious API data', () => {
    it('should display Functional Skills and In Prison Qualifications And Achievements data', () => {
      // Given
      cy.task('stubLearnerEducationWithCoursesQualificationsCompletedInLast12Months')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/overview`)
      const overviewPage = Page.verifyOnPage(OverviewPage)

      // When
      overviewPage.selectTab('Education and training')
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // Then
      educationAndTrainingPage //
        .activeTabIs('Education and training')
        .hasFunctionalSkillsDisplayed()
        .hasCompletedInPrisonQualificationsLast12MonthsDisplayed()
        .hasCompletedInPrisonQualificationRecordDisplayed('GCSE Maths')
        .coursesAndQualificationsLinkShouldExist()
    })

    it('should display message and view all link if prisoner has no completed courses or qualifications within last 12 months but does have older courses and qualifications', () => {
      // Given
      cy.task('stubGetInductionShortQuestionSet')
      cy.task('stubLearnerEducationWithCoursesQualificationsCompletedInLast12Months')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/overview`)
      const overviewPage = Page.verifyOnPage(OverviewPage)

      // When
      overviewPage.selectTab('Education and training')
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // Then
      educationAndTrainingPage //
        .activeTabIs('Education and training')
        .hasNoCoursesAndQualificationsLast12MonthsMessageDisplayed()
        .coursesAndQualificationsLinkShouldExist()
    })

    it('should display message but not display view all link if prisoner has no completed courses', () => {
      // Given
      cy.task('stubGetInductionShortQuestionSet')
      cy.task('stubLearnerEducationWithNoCoursesQualifications')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/overview`)
      const overviewPage = Page.verifyOnPage(OverviewPage)

      // When
      overviewPage.selectTab('Education and training')
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // Then
      educationAndTrainingPage //
        .activeTabIs('Education and training')
        .hasNoCoursesAndQualificationsLast12MonthsMessageDisplayed()
        .coursesAndQualificationsLinkShouldNotExist()
    })

    it('should display Functional Skills and In Prison Qualifications And Achievements data given curious API returns a 404 for the learner profile', () => {
      // Given
      cy.task('stubLearnerProfile404Error')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/overview`)
      const overviewPage = Page.verifyOnPage(OverviewPage)

      // When
      overviewPage.selectTab('Education and training')
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // Then
      educationAndTrainingPage //
        .activeTabIs('Education and training')
        .hasFunctionalSkillsDisplayed()
        .hasCompletedInPrisonQualificationsLast12MonthsDisplayed()
    })

    it('should display Functional Skills and In Prison Qualifications And Achievements data given curious API returns a 404 for the learner education', () => {
      // Given
      cy.task('stubLearnerEducation404Error')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/overview`)
      const overviewPage = Page.verifyOnPage(OverviewPage)

      // When
      overviewPage.selectTab('Education and training')
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // Then
      educationAndTrainingPage //
        .activeTabIs('Education and training')
        .hasFunctionalSkillsDisplayed()
        .hasCompletedInPrisonQualificationsLast12MonthsDisplayed()
    })

    it('should display curious unavailable message given curious is unavailable for the learner profile', () => {
      // Given
      cy.task('stubLearnerProfile401Error')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/overview`)
      const overviewPage = Page.verifyOnPage(OverviewPage)

      // When
      overviewPage.selectTab('Education and training')
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // Then
      educationAndTrainingPage //
        .activeTabIs('Education and training')
        .doesNotHaveFunctionalSkillsDisplayed()
        .hasCuriousUnavailableMessageDisplayed()
        .hasCompletedInPrisonQualificationsLast12MonthsDisplayed()
    })

    it('should display curious unavailable message given curious is unavailable for the learner education', () => {
      // Given
      cy.task('stubLearnerEducation401Error')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/overview`)
      const overviewPage = Page.verifyOnPage(OverviewPage)

      // When
      overviewPage.selectTab('Education and training')
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // Then
      educationAndTrainingPage //
        .activeTabIs('Education and training')
        .hasFunctionalSkillsDisplayed()
        .doesNotCompletedInPrisonQualificationsLast12MonthsDisplayed()
        .hasCuriousUnavailableMessageDisplayed()
    })
  })

  describe('should retrieve and render data from PLP API Induction data', () => {
    it('should display Qualifications And Education given Induction was the long question set', () => {
      // Given
      cy.task('stubGetInductionLongQuestionSet')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/overview`)
      const overviewPage = Page.verifyOnPage(OverviewPage)

      // When
      overviewPage.selectTab('Education and training')
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // Then
      educationAndTrainingPage //
        .activeTabIs('Education and training')
        .isShowingLongQuestionSetAnswers()
    })

    it('should display Qualifications And Education given Induction was the short question set', () => {
      // Given
      cy.task('stubGetInductionShortQuestionSet')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/overview`)
      const overviewPage = Page.verifyOnPage(OverviewPage)

      // When
      overviewPage.selectTab('Education and training')
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // Then
      educationAndTrainingPage //
        .activeTabIs('Education and training')
        .isShowingShortQuestionSetAnswers()
    })

    it('should display Induction unavailable message given PLP API is unavailable when retrieving the Induction', () => {
      // Given
      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/overview`)
      const overviewPage = Page.verifyOnPage(OverviewPage)

      // Stub a PLP API 500 error *after* rendering the overview page. The scenario here is that the user has signed in and
      // displayed the Prisoner List and Overview screens, but between displaying the Overview and clicking on
      // 'Education and training' the PLP API has gone done.
      cy.task('stubGetInduction500Error')

      // When
      overviewPage.selectTab('Education and training')
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // Then
      educationAndTrainingPage //
        .activeTabIs('Education and training')
        .hasInductionUnavailableMessageDisplayed()
    })

    it('should display link to create Induction given prisoner does not have an Induction yet', () => {
      // Given
      cy.task('stubGetInduction404Error')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/overview`)
      const overviewPage = Page.verifyOnPage(OverviewPage)

      // When
      overviewPage.selectTab('Education and training')
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // Then
      educationAndTrainingPage //
        .activeTabIs('Education and training')
        .hasLinkToCreateInductionDisplayed()
    })
  })

  describe('should display change links to Induction questions', () => {
    it(`should link to the change in-prison training interests page`, () => {
      // Given
      cy.task('stubGetInductionShortQuestionSet')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // When
      educationAndTrainingPage.clickToChangeInPrisonTraining()

      // Then
      Page.verifyOnPage(InPrisonTrainingPage)
    })

    it(`should link to the change Highest Level of Education page`, () => {
      // Given
      cy.task('stubGetInductionLongQuestionSet')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // When
      educationAndTrainingPage.clickToChangeHighestLevelOfEducation()

      // Then
      Page.verifyOnPage(HighestLevelOfEducationPage)
    })
  })

  describe('should display a link to view all courses and qualifications', () => {
    it(`should link to the courses and qualifications page`, () => {
      // Given
      cy.task('stubGetInductionShortQuestionSet')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // When
      educationAndTrainingPage.clickViewAllCoursesAndQualificationsLink()

      // Then
      Page.verifyOnPage(InPrisonCoursesAndQualificationsPage)
    })
  })
})
