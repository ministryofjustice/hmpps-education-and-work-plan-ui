import InPrisonCoursesAndQualificationsPage from '../../pages/inPrisonCoursesAndQualifications/InPrisonCoursesAndQualificationsPage'
import Page from '../../pages/page'
import AuthSignInPage from '../../pages/authSignIn'

context('In Prison Courses and Qualifications', () => {
  context('PLP user', () => {
    const prisonNumber = 'G6115VJ'

    beforeEach(() => {
      cy.task('stubGetAllPrisons')
      cy.signInAsUserWithContributorAuthorityToArriveOnPrisonerListPage()
    })

    it('should display completed In Prison courses', () => {
      // Given
      cy.task('stubLearnerQualificationsWithCompletedCoursesOlderThanLast12Months') // Stub learner qualificiation has 1 completed course - GCSE Maths

      cy.visit(`/plan/${prisonNumber}/in-prison-courses-and-qualifications`)
      const inPrisonCoursePage = Page.verifyOnPage(InPrisonCoursesAndQualificationsPage)

      // When
      inPrisonCoursePage.clickCompletedCoursesTab()

      // Then
      inPrisonCoursePage.hasCompletedCourse('GCSE Maths')
    })

    it('should display in-progress In Prison courses', () => {
      // Given
      cy.task('stubLearnerQualifications') // Stub learner qualifications has 1 in progress course - GCSE English

      cy.visit(`/plan/${prisonNumber}/in-prison-courses-and-qualifications`)
      const inPrisonCoursePage = Page.verifyOnPage(InPrisonCoursesAndQualificationsPage)

      // When
      inPrisonCoursePage.clickInProgressCoursesTab()

      // Then
      inPrisonCoursePage.hasInProgressCourse('GCSE English')
    })

    it('should display withdrawn In Prison courses', () => {
      // Given
      cy.task('stubLearnerQualificationsWithWithdrawnCourses') // Stub learner qualifications has 1 withdrawn course (GCSE Maths) and 1 temporarily withdrawn course (Bricklaying)

      cy.visit(`/plan/${prisonNumber}/in-prison-courses-and-qualifications`)
      const inPrisonCoursePage = Page.verifyOnPage(InPrisonCoursesAndQualificationsPage)

      // When
      inPrisonCoursePage.clickWithdrawnCoursesTab()

      // Then
      inPrisonCoursePage //
        .hasWithdrawnCourse('GCSE Maths')
        .hasWithdrawnCourse('BTEC Bricklaying for beginners')
    })

    it('should display no courses messages given prisoner with no In Prison course data', () => {
      // Given
      cy.task('stubLearnerQualificationsWithNoCourses')

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

    it('should display curious unavailable message given curious is unavailable for the learner qualifications', () => {
      // Given
      cy.task('stubLearnerQualifications500Error')

      cy.visit(`/plan/${prisonNumber}/in-prison-courses-and-qualifications`)

      // When
      const inPrisonCoursePage = Page.verifyOnPage(InPrisonCoursesAndQualificationsPage)

      // Then
      inPrisonCoursePage.hasCuriousUnavailableMessageDisplayed()
    })
  })

  context('DPS user', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubGetAllPrisons')
      cy.task('stubSignIn', { roles: ['ROLE_SOME_NON_PLP_ROLE'] })
      cy.signIn()
    })

    context(`Users caseload matches prisoner's prison`, () => {
      const prisonNumber = 'G9981UK' // Prisoner is in BXI; one of the user's caseload IDs is BXI

      beforeEach(() => {
        cy.task('getPrisonerById', prisonNumber)
        cy.task('stubLearnerAssessments', prisonNumber)
      })

      it('should display completed In Prison courses', () => {
        // Given
        cy.task('stubLearnerQualificationsWithCompletedCoursesOlderThanLast12Months', prisonNumber) // Stub learner qualifications has 1 completed course - GCSE Maths

        cy.visit(`/prisoner/${prisonNumber}/work-and-skills/in-prison-courses-and-qualifications`)
        const inPrisonCoursePage = Page.verifyOnPage(InPrisonCoursesAndQualificationsPage)

        // When
        inPrisonCoursePage.clickCompletedCoursesTab()

        // Then
        inPrisonCoursePage.hasCompletedCourse('GCSE Maths')
      })

      it('should display in-progress In Prison courses', () => {
        // Given
        cy.task('stubLearnerQualifications', prisonNumber) // Stub learner qualifications has 1 in progress course - GCSE English

        cy.visit(`/prisoner/${prisonNumber}/work-and-skills/in-prison-courses-and-qualifications`)
        const inPrisonCoursePage = Page.verifyOnPage(InPrisonCoursesAndQualificationsPage)

        // When
        inPrisonCoursePage.clickInProgressCoursesTab()

        // Then
        inPrisonCoursePage.hasInProgressCourse('GCSE English')
      })

      it('should display withdrawn In Prison courses', () => {
        // Given
        cy.task('stubLearnerQualificationsWithWithdrawnCourses', prisonNumber) // Stub learner qualifications has 1 withdrawn course (GCSE Maths) and 1 temporarily withdrawn course (Bricklaying)

        cy.visit(`/prisoner/${prisonNumber}/work-and-skills/in-prison-courses-and-qualifications`)
        const inPrisonCoursePage = Page.verifyOnPage(InPrisonCoursesAndQualificationsPage)

        // When
        inPrisonCoursePage.clickWithdrawnCoursesTab()

        // Then
        inPrisonCoursePage //
          .hasWithdrawnCourse('GCSE Maths')
          .hasWithdrawnCourse('BTEC Bricklaying for beginners')
      })

      it('should display no courses messages given prisoner with no In Prison course data', () => {
        // Given
        cy.task('stubLearnerQualificationsWithNoCourses', prisonNumber)

        cy.visit(`/prisoner/${prisonNumber}/work-and-skills/in-prison-courses-and-qualifications`)

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
    })

    it('should display curious unavailable message given curious is unavailable for the learner qualifications', () => {
      // Given
      const prisonNumber = 'G9981UK'
      cy.task('getPrisonerById', prisonNumber)

      cy.task('stubLearnerQualifications500Error', prisonNumber)

      cy.visit(`/prisoner/${prisonNumber}/work-and-skills/in-prison-courses-and-qualifications`)

      // When
      const inPrisonCoursePage = Page.verifyOnPage(InPrisonCoursesAndQualificationsPage)

      // Then
      inPrisonCoursePage.hasCuriousUnavailableMessageDisplayed()
    })

    it(`should not display in-prison courses & qualifications page given user's caseloads are not for the prisoner's current prison`, () => {
      // Given
      const prisonNumber = 'A9404DY' // Prisoner is in Pentonville (PVI) which is not one of the user's caseloads
      cy.task('getPrisonerById', prisonNumber)

      // When
      cy.visit(`/prisoner/${prisonNumber}/work-and-skills/in-prison-courses-and-qualifications`)

      // Then
      Page.verifyOnPage(AuthSignInPage)
    })

    context('Restricted patients', () => {
      beforeEach(() => {
        cy.signOut()
        cy.task('reset')
        cy.task('stubSignIn', { roles: ['ROLE_SOME_NON_PLP_ROLE', 'ROLE_POM'] }) // Users with POM role can see restricted patients (prisoners with prisonId OUT) as long as their caseload ID matches prisoners supporting prison ID
        cy.task('stubLearnerAssessments')
        cy.task('stubLearnerQualifications')
        cy.signIn()
      })

      it(`should not display in-prison courses & qualifications page given prisoner is OUT and user's caseloads are not for the prisoner's supporting prison`, () => {
        // Given
        const prisonNumber = 'G0577GL' // Prisoner is OUT (eg: hospital) and their supporting prison is Pentonville (PVI) which is not one of the user's caseloads
        cy.task('getPrisonerById', prisonNumber)

        // When
        cy.visit(`/prisoner/${prisonNumber}/work-and-skills/in-prison-courses-and-qualifications`)

        // Then
        Page.verifyOnPage(AuthSignInPage)
      })

      it(`should display in-prison courses & qualifications page given prisoner is OUT and user's caseloads is for the prisoner's supporting prison`, () => {
        // Given
        const prisonNumber = 'A8520DZ' // Prisoner is OUT (eg: hospital) and their supporting prison is Brixton (BXI) which is not one of the user's caseloads
        cy.task('getPrisonerById', prisonNumber)
        cy.task('stubLearnerAssessments', prisonNumber)
        cy.task('stubLearnerQualifications', prisonNumber)

        // When
        cy.visit(`/prisoner/${prisonNumber}/work-and-skills/in-prison-courses-and-qualifications`)

        // Then
        Page.verifyOnPage(InPrisonCoursesAndQualificationsPage)
      })

      it(`should display in-prison courses & qualifications page given prisoner is OUT and user is an Inactive Bookings user and user's caseloads are not for the prisoner's supporting prison`, () => {
        // Given
        cy.signOut()
        cy.task('stubSignIn', { roles: ['ROLE_SOME_NON_PLP_ROLE', 'ROLE_INACTIVE_BOOKINGS', 'ROLE_POM'] }) // Users with INACTIVE_BOOKINGS and POM roles can see any restricted patients
        cy.signIn()

        const prisonNumber = 'G0577GL' // Prisoner is OUT (eg: hospital) and their supporting prison is Pentonville (PVI) which is not one of the user's caseloads
        cy.task('getPrisonerById', prisonNumber)
        cy.task('stubLearnerAssessments', prisonNumber)
        cy.task('stubLearnerQualifications', prisonNumber)

        // When
        cy.visit(`/prisoner/${prisonNumber}/work-and-skills/in-prison-courses-and-qualifications`)

        // Then
        Page.verifyOnPage(InPrisonCoursesAndQualificationsPage)
      })
    })
  })
})
