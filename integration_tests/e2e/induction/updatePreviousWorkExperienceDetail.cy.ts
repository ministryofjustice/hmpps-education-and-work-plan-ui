import Page from '../../pages/page'
import WorkAndInterestsPage from '../../pages/overview/WorkAndInterestsPage'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'
import PreviousWorkExperienceDetailPage from '../../pages/induction/PreviousWorkExperienceDetailPage'
import Error404Page from '../../pages/error404'

context('Update previous work experience details in the Induction', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('stubAuthUser')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('stubUpdateInduction')
    cy.task('stubGetInduction')
    cy.signIn()
  })

  it('should update Previous Work Experience Detail given page submitted with changed job role and detail and no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'

    // Induction has previous work experiences of Office and Other
    cy.visit(`/prisoners/${prisonNumber}/induction/previous-work-experience/office`)
    const previousWorkExperienceDetailPage = Page.verifyOnPage(PreviousWorkExperienceDetailPage)

    // When
    previousWorkExperienceDetailPage //
      .setJobRole('Office manager')
      .setJobDetails('Managing a busy office with staff responsibility for 5 interns')
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(@.previousWorkExperiences.experiences.size() == 2 && ' +
              "@.previousWorkExperiences.experiences[0].experienceType == 'OFFICE' && @.previousWorkExperiences.experiences[0].experienceTypeOther == null && " +
              "@.previousWorkExperiences.experiences[0].role == 'Office manager' && @.previousWorkExperiences.experiences[0].details == 'Managing a busy office with staff responsibility for 5 interns' && " +
              "@.previousWorkExperiences.experiences[1].experienceType == 'OTHER' && @.previousWorkExperiences.experiences[1].experienceTypeOther == 'Finance' &&" +
              "@.previousWorkExperiences.experiences[1].role == 'Trader' && @.previousWorkExperiences.experiences[1].details == 'Some trading tasks')]",
          ),
        ),
    )
  })

  it('should not update Previous Work Experience Detail given page submitted with validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'

    // Induction has previous work experiences of Office and Other
    cy.visit(`/prisoners/${prisonNumber}/induction/previous-work-experience/office`)
    let previousWorkExperienceDetailPage = Page.verifyOnPage(PreviousWorkExperienceDetailPage)

    // When
    previousWorkExperienceDetailPage //
      .setJobRole('Office manager')
      .clearJobDetails()
      .submitPage()

    // Then
    previousWorkExperienceDetailPage = Page.verifyOnPage(PreviousWorkExperienceDetailPage)
    previousWorkExperienceDetailPage.hasFieldInError('jobDetails')
    cy.wiremockVerifyNoInteractions(putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)))
  })

  it('should display 404 page given Previous Work Experience Type specified on path that does not exist in the Induction', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    // Induction has previous work experiences of Office and Other

    // When
    cy.visit(`/prisoners/${prisonNumber}/induction/previous-work-experience/construction`, {
      failOnStatusCode: false,
    })

    // Then
    Page.verifyOnPage(Error404Page)
  })

  it('should display 404 page given invalid Previous Work Experience Type specified on path', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    // Induction has previous work experiences of Office and Other

    // When
    cy.visit(`/prisoners/${prisonNumber}/induction/previous-work-experience/some-invalid-type`, {
      failOnStatusCode: false,
    })

    // Then
    Page.verifyOnPage(Error404Page)
  })
})
