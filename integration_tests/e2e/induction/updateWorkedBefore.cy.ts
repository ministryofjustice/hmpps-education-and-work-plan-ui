import Page from '../../pages/page'
import WorkedBeforePage from '../../pages/induction/WorkedBeforePage'
import WorkAndInterestsPage from '../../pages/overview/WorkAndInterestsPage'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'
import HasWorkedBeforeValue from '../../../server/enums/hasWorkedBeforeValue'
import PreviousWorkExperienceTypesPage from '../../pages/induction/PreviousWorkExperienceTypesPage'
import TypeOfWorkExperienceValue from '../../../server/enums/typeOfWorkExperienceValue'
import PreviousWorkExperienceDetailPage from '../../pages/induction/PreviousWorkExperienceDetailPage'

context('Update whether a prisoner has worked before in an Induction', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubAuthUser')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('stubUpdateInduction')
    cy.signIn()
  })

  it('should update Worked Before to Yes and pass to work experience pages given page submitted with changed value and no validation errors', () => {
    cy.task('stubGetInduction', { hasWorkedBefore: HasWorkedBeforeValue.NO })
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`prisoners/${prisonNumber}/induction/has-worked-before`)
    const workedBeforePage = Page.verifyOnPage(WorkedBeforePage)
      .hasBackLinkTo(`/plan/${prisonNumber}/view/work-and-interests`)
      .backLinkHasAriaLabel(`Back to Daniel Craig's learning and work progress`)

    // When
    workedBeforePage //
      .selectWorkedBefore(HasWorkedBeforeValue.YES)
      .submitPage()
    Page.verifyOnPage(PreviousWorkExperienceTypesPage)
      .selectPreviousWorkExperience(TypeOfWorkExperienceValue.OFFICE)
      .submitPage()
    Page.verifyOnPage(PreviousWorkExperienceDetailPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/previous-work-experience`)
      .setJobRole('Office junior')
      .setJobDetails('Making the teas')
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)

    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.previousWorkExperiences.hasWorkedBefore == 'YES' && " +
              '@.previousWorkExperiences.experiences.size() == 1 && ' +
              "@.previousWorkExperiences.experiences[0].experienceType == 'OFFICE' && " +
              "@.previousWorkExperiences.experiences[0].role == 'Office junior' && " +
              "@.previousWorkExperiences.experiences[0].details == 'Making the teas')]",
          ),
        ),
    )
  })

  it('should update Worked Before to No given page submitted with changed value and no validation errors', () => {
    // Given
    cy.task('stubGetInduction', { hasWorkedBefore: HasWorkedBeforeValue.YES })
    const prisonNumber = 'G6115VJ'
    cy.visit(`prisoners/${prisonNumber}/induction/has-worked-before`)
    const workedBeforePage = Page.verifyOnPage(WorkedBeforePage)
      .hasBackLinkTo(`/plan/${prisonNumber}/view/work-and-interests`)
      .backLinkHasAriaLabel(`Back to Daniel Craig's learning and work progress`)

    // When
    workedBeforePage //
      .selectWorkedBefore(HasWorkedBeforeValue.NO)

    workedBeforePage //
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(matchingJsonPath(`$[?(@.previousWorkExperiences.hasWorkedBefore == 'NO')]`)),
    )
  })

  it('should update Worked Before to Not relevant given page submitted with changed value and no validation errors', () => {
    // Given
    cy.task('stubGetInduction', { hasWorkedBefore: HasWorkedBeforeValue.YES })
    const prisonNumber = 'G6115VJ'
    cy.visit(`prisoners/${prisonNumber}/induction/has-worked-before`)
    const workedBeforePage = Page.verifyOnPage(WorkedBeforePage)
      .hasBackLinkTo(`/plan/${prisonNumber}/view/work-and-interests`)
      .backLinkHasAriaLabel(`Back to Daniel Craig's learning and work progress`)

    // When
    workedBeforePage //
      .selectWorkedBefore(HasWorkedBeforeValue.NOT_RELEVANT)
      .setNotRelevantReason(
        'Chris feels his previous work experience is not relevant as he is not planning on working upon release.',
      )
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.previousWorkExperiences.hasWorkedBefore == 'NOT_RELEVANT' && " +
              "@.previousWorkExperiences.hasWorkedBeforeNotRelevantReason == 'Chris feels his previous work experience is not relevant as he is not planning on working upon release.')]",
          ),
        ),
    )
  })
})
