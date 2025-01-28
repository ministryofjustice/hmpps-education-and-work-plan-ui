import Page from '../../pages/page'
import AdditionalTrainingPage from '../../pages/induction/AdditionalTrainingPage'
import EducationAndTrainingPage from '../../pages/overview/EducationAndTrainingPage'
import AdditionalTrainingValue from '../../../server/enums/additionalTrainingValue'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context('Update additional training within an Induction', () => {
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
    cy.task('stubGetInduction')
    cy.signIn()
  })

  it('should update additional training given page submitted with changed values and no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/additional-training`)
    const additionalTrainingPage = Page.verifyOnPage(AdditionalTrainingPage)
      .hasBackLinkTo(`/plan/${prisonNumber}/view/education-and-training`)
      .backLinkHasAriaLabel(`Back to Daniel Craig's learning and work progress`)

    // When
    additionalTrainingPage //
      .deSelectAdditionalTraining(AdditionalTrainingValue.FULL_UK_DRIVING_LICENCE)
      .deSelectAdditionalTraining(AdditionalTrainingValue.OTHER)
      .selectAdditionalTraining(AdditionalTrainingValue.CSCS_CARD)
      .submitPage()

    // Then
    Page.verifyOnPage(EducationAndTrainingPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(@.previousTraining.trainingTypes.size() == 2 && ' +
              "@.previousTraining.trainingTypes[0] == 'CSCS_CARD' && " +
              "@.previousTraining.trainingTypes[1] == 'HGV_LICENCE')]",
          ),
        ),
    )
  })

  it('should update additional training given page submitted with values changed to NONE and no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/additional-training`)
    const additionalTrainingPage = Page.verifyOnPage(AdditionalTrainingPage)

    // When
    additionalTrainingPage //
      .selectAdditionalTraining(AdditionalTrainingValue.NONE)
      .submitPage()

    // Then
    Page.verifyOnPage(EducationAndTrainingPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.previousTraining.trainingTypes.size() == 1 && @.previousTraining.trainingTypes[0] == 'NONE')]",
          ),
        ),
    )
  })

  it('should not update additional training given page submitted with validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/additional-training`)
    let additionalTrainingPage = Page.verifyOnPage(AdditionalTrainingPage)

    // When
    additionalTrainingPage //
      .clearAdditionalTrainingOther()
      .submitPage()

    // Then
    additionalTrainingPage = Page.verifyOnPage(AdditionalTrainingPage)
    additionalTrainingPage.hasFieldInError('additionalTrainingOther')
    cy.wiremockVerifyNoInteractions(putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)))
  })

  it('should not update additional training given page submitted with no values', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/additional-training`)
    let additionalTrainingPage = Page.verifyOnPage(AdditionalTrainingPage)

    // When
    additionalTrainingPage //
      .deSelectAdditionalTraining(AdditionalTrainingValue.FULL_UK_DRIVING_LICENCE)
      .deSelectAdditionalTraining(AdditionalTrainingValue.HGV_LICENCE)
      .deSelectAdditionalTraining(AdditionalTrainingValue.OTHER)
      .submitPage()

    // Then
    additionalTrainingPage = Page.verifyOnPage(AdditionalTrainingPage)
    additionalTrainingPage.hasErrorCount(1)
    additionalTrainingPage.hasFieldInError('additionalTraining')
    cy.wiremockVerifyNoInteractions(putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)))
  })
})
