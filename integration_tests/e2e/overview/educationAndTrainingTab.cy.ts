import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'
import EducationAndTrainingPage from '../../pages/overview/EducationAndTrainingPage'
import InPrisonTrainingPage from '../../pages/induction/InPrisonTrainingPage'
import HighestLevelOfEducationPage from '../../pages/induction/HighestLevelOfEducationPage'
import AdditionalTrainingPage from '../../pages/induction/AdditionalTrainingPage'
import QualificationsListPage from '../../pages/induction/QualificationsListPage'

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
    cy.task('stubGetAllPrisons')
  })

  describe('should retrieve and render Functional Skills from Curious API data', () => {
    // Functional skills come from the Curious API /learnerProfile

    it('should display Functional Skills', () => {
      // Given
      cy.task('stubLearnerProfile') // Learner profile stub has Maths and Digital Literacy, but not English

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
        .hasFunctionalSkillWithAssessmentScoreDisplayed('MATHS')
        .hasFunctionalSkillWithAssessmentScoreDisplayed('DIGITAL_LITERACY')
        .hasFunctionalSkillWithNoAssessmentScoreMessageDisplayed('ENGLISH') // English & Maths are always displayed, even if not in the returned data
    })

    it('should display message saying no assessment scores for Maths and English are recorded given curious API returns a 404 for the learner profile', () => {
      // Given
      cy.task('stubLearnerProfile404Error') // Curious 404 for /learnerProfile means there are no Functional Skills recprded for the prisoner

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
        .hasFunctionalSkillWithNoAssessmentScoreMessageDisplayed('ENGLISH') // English & Maths are always displayed, even if not in the returned data
        .hasFunctionalSkillWithNoAssessmentScoreMessageDisplayed('MATHS') // English & Maths are always displayed, even if not in the returned data
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
    })
  })

  describe('should retrieve and render In Prison Courses from Curious API data', () => {
    // In Prison Courses come from the Curious API /learnerEducation

    it('should display In Prison Courses completed in the last 12 months', () => {
      // Given
      cy.task('stubLearnerEducationWithCompletedCoursesInLast12Months') // Learner education stub has GCSE Maths completed in last 12 months

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
        .hasCompletedCourseInLast12MonthsDisplayed('GCSE Maths')
        .hasLinkToViewAllCourses()
    })

    it('should display message and view all link if prisoner has no completed courses within last 12 months but does have older courses', () => {
      // Given
      cy.task('stubLearnerEducationWithCompletedCoursesOlderThanLast12Months')

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
        .hasNoCompletedCoursesInLast12MonthsDisplayed()
        .hasLinkToViewAllCourses()
    })

    it('should display message but not display view all link if prisoner has no completed courses', () => {
      // Given
      cy.task('stubLearnerEducationWithNoCourses')

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
        .hasNoCompletedCoursesInLast12MonthsDisplayed()
        .doesNotHaveLinkToViewAllCourses()
    })

    it('should not display In Prison courses given curious API returns a 404 for the learner education', () => {
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
        .hasNoCompletedCoursesInLast12MonthsDisplayed()
        .doesNotHaveLinkToViewAllCourses()
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
        .doesNotHaveCompletedCoursesInLast12MonthsDisplayed()
        .hasCuriousUnavailableMessageDisplayed()
    })
  })

  describe('should retrieve and render data from PLP API Induction data', () => {
    it('should display Qualifications And Education data', () => {
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

    it(`should link to the change Additional Training page given long question set`, () => {
      // Given
      cy.task('stubGetInductionLongQuestionSet')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // When
      educationAndTrainingPage.clickToChangeAdditionalTraining()

      // Then
      Page.verifyOnPage(AdditionalTrainingPage)
    })

    it(`should link to the change Additional Training page given short question set`, () => {
      // Given
      cy.task('stubGetInductionShortQuestionSet')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // When
      educationAndTrainingPage.clickToChangeAdditionalTraining()

      // Then
      Page.verifyOnPage(AdditionalTrainingPage)
    })

    it(`should link to the change Educational Qualifications page given long question set`, () => {
      // Given
      cy.task('stubGetInductionLongQuestionSet')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // When
      educationAndTrainingPage.clickToChangeEducationalQualifications()

      // Then
      Page.verifyOnPage(QualificationsListPage)
    })

    it(`should link to the change Educational Qualifications page given short question set`, () => {
      // Given
      cy.task('stubGetInductionShortQuestionSet')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // When
      educationAndTrainingPage.clickToChangeEducationalQualifications()

      // Then
      Page.verifyOnPage(QualificationsListPage)
    })
  })
})
