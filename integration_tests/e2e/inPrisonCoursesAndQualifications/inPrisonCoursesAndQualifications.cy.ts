import InPrisonCoursesAndQualificationsPage from '../../pages/inPrisonCoursesAndQualifications/InPrisonCoursesAndQualificationsPage'
import Page from '../../pages/page'

context('In Prison Courses and Qualifications', () => {
  const prisonNumber = 'G6115VJ'

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithViewAuthority')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('getPrisonerById')
    cy.task('stubLearnerProfile')
    cy.signIn()
  })

  it('should display completed In Prison courses', () => {
    // Given
    cy.task('stubLearnerEducationWithCompletedCoursesOlderThanLast12Months') // Stub learner education has 1 completed course - GCSE Maths

    cy.visit(`/plan/${prisonNumber}/in-prison-courses-and-qualifications`)
    const inPrisonCoursePage = Page.verifyOnPage(InPrisonCoursesAndQualificationsPage)

    // When
    inPrisonCoursePage.clickCompletedCoursesTab()

    // Then
    inPrisonCoursePage.hasCompletedCourse('GCSE Maths')
  })

  it('should display in-progress In Prison courses', () => {
    // Given
    cy.task('stubLearnerEducation') // Stub learner education has 1 in progress course - GCSE English

    cy.visit(`/plan/${prisonNumber}/in-prison-courses-and-qualifications`)
    const inPrisonCoursePage = Page.verifyOnPage(InPrisonCoursesAndQualificationsPage)

    // When
    inPrisonCoursePage.clickInProgressCoursesTab()

    // Then
    inPrisonCoursePage.hasInProgressCourse('GCSE English')
  })

  it('should display no courses messages given prisoner with no In Prison course data', () => {
    // Given
    cy.task('stubLearnerEducationWithNoCourses')

    cy.visit(`/plan/${prisonNumber}/in-prison-courses-and-qualifications`)

    // When
    const inPrisonCoursePage = Page.verifyOnPage(InPrisonCoursesAndQualificationsPage)

    // Then
    inPrisonCoursePage //
      .clickCompletedCoursesTab()
      .hasNoCompletedCourses()
      .clickInProgressCoursesTab()
      .hasNoInProgressCourses()
      .clickWithdrawnCoursesTab()
      .hasNoWithdrawnCourses()
  })

  it('should display curious unavailable message given curious is unavailable for the learner education', () => {
    // Given
    cy.task('stubLearnerEducation401Error')

    cy.visit(`/plan/${prisonNumber}/in-prison-courses-and-qualifications`)

    // When
    const inPrisonCoursePage = Page.verifyOnPage(InPrisonCoursesAndQualificationsPage)

    // Then
    inPrisonCoursePage.hasCuriousUnavailableMessageDisplayed()
  })
})
