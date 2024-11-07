import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'
import EducationAndTrainingPage from '../../pages/overview/EducationAndTrainingPage'
import InPrisonTrainingPage from '../../pages/induction/InPrisonTrainingPage'
import AdditionalTrainingPage from '../../pages/induction/AdditionalTrainingPage'
import QualificationsListPage from '../../pages/prePrisonEducation/QualificationsListPage'
import AuthorisationErrorPage from '../../pages/authorisationError'

context('Prisoner Overview page - Education And Training tab', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithViewAuthority')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('stubGetInduction')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('stubGetInduction')
    cy.task('stubGetEducation')
    cy.task('stubGetAllPrisons')
    cy.task('getActionPlan')
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
        .hasEducationOrInductionUnavailableMessageDisplayed()
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

  describe('should retrieve and render data from PLP API Education data', () => {
    it('should display Qualifications And Education data', () => {
      // Given
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
        .hasEducationQualificationsDisplayed()
    })

    it('should display add education message given prisoner has no education record yet', () => {
      // Given
      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/overview`)
      const overviewPage = Page.verifyOnPage(OverviewPage)
      cy.task('stubGetEducation404Error')

      // When
      overviewPage.selectTab('Education and training')
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // Then
      educationAndTrainingPage //
        .activeTabIs('Education and training')
        .hasAddEducationMessageDisplayed()
    })

    it('should display unavailable message given PLP API is unavailable when retrieving education', () => {
      // Given
      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/overview`)
      const overviewPage = Page.verifyOnPage(OverviewPage)

      // Stub a PLP API 500 error *after* rendering the overview page. The scenario here is that the user has signed in and
      // displayed the Prisoner List and Overview screens, but between displaying the Overview and clicking on
      // 'Education and training' the PLP API has gone down.
      cy.task('stubGetEducation500Error')

      // When
      overviewPage.selectTab('Education and training')
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // Then
      educationAndTrainingPage //
        .activeTabIs('Education and training')
        .hasEducationOrInductionUnavailableMessageDisplayed()
    })
  })

  describe('change links to Induction & Education questions', () => {
    it(`should link to the change in-prison training interests page for users with edit authority`, () => {
      // Given
      cy.task('stubSignInAsUserWithEditAuthority')
      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // When
      educationAndTrainingPage.clickToChangeInPrisonTraining()

      // Then
      Page.verifyOnPage(InPrisonTrainingPage)
    })

    it(`should link to auth-error page for users with read-only authority`, () => {
      // Given
      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // When
      educationAndTrainingPage.clickToChangeInPrisonTrainingReadOnlyUser()

      // Then
      Page.verifyOnPage(AuthorisationErrorPage)
    })

    it(`should display a link to the change Highest Level of Education page`, () => {
      // Given
      cy.task('stubSignInAsUserWithEditAuthority')
      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/education-and-training`)

      // When
      const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

      // Then
      educationAndTrainingPage //
        .activeTabIs('Education and training')
        .highestLevelOfEducationChangeLinkHasText('Change')
    })

    describe('change links to Additional Training questions', () => {
      it(`should link to the change Additional Training page for users with edit authority`, () => {
        // Given
        cy.task('stubSignInAsUserWithEditAuthority')
        cy.signIn()
        const prisonNumber = 'G6115VJ'
        cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
        const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

        // When
        educationAndTrainingPage.clickToChangeAdditionalTraining()

        // Then
        Page.verifyOnPage(AdditionalTrainingPage)
      })

      it(`should link to auth-error page for users with read-only authority`, () => {
        // Given
        cy.signIn()
        const prisonNumber = 'G6115VJ'
        cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
        const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

        // When
        educationAndTrainingPage.clickToChangeAdditionalTrainingReadOnlyUser()

        // Then
        Page.verifyOnPage(AuthorisationErrorPage)
      })
    })

    describe('change Educational Qualifications link', () => {
      it(`should link to the change Educational Qualifications page given Education record has qualifications and user has edit authority`, () => {
        // Given
        cy.task('stubSignInAsUserWithEditAuthority')
        cy.signIn()
        const prisonNumber = 'G6115VJ'
        cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
        const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

        // When
        educationAndTrainingPage.clickToChangeEducationalQualifications()

        // Then
        Page.verifyOnPage(QualificationsListPage) // Expect to be on the Qualifications List page because the induction had qualifications to start with
          .hasBackLinkTo(`/plan/${prisonNumber}/view/education-and-training`)
      })

      it(`should link to auth-error page given user has read-only authority`, () => {
        // Given
        cy.signIn()
        const prisonNumber = 'G6115VJ'
        cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
        const educationAndTrainingPage = Page.verifyOnPage(EducationAndTrainingPage)

        // When
        educationAndTrainingPage.clickToChangeEducationalQualificationsReadOnlyUser()

        // Then
        Page.verifyOnPage(AuthorisationErrorPage)
      })
    })
  })
})
