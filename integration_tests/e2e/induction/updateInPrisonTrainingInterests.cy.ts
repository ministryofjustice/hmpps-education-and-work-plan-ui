import Page from '../../pages/page'
import InPrisonTrainingPage from '../../pages/induction/InPrisonTrainingPage'
import EducationAndTrainingPage from '../../pages/overview/EducationAndTrainingPage'
import InPrisonTrainingValue from '../../../server/enums/inPrisonTrainingValue'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context('Update in-prison training interests within an Induction', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('getPrisonerById')
    cy.task('stubLearnerAssessments')
    cy.task('stubLearnerQualifications')
    cy.task('stubUpdateInduction')
    cy.task('stubGetInduction')
    cy.signIn()
  })

  it('should update in-prison training interests given page submitted with changed values and no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/in-prison-training`)
    const inPrisonTrainingPage = Page.verifyOnPage(InPrisonTrainingPage)

    // When
    inPrisonTrainingPage //
      .deSelectInPrisonTraining(InPrisonTrainingValue.MACHINERY_TICKETS)
      .selectInPrisonTraining(InPrisonTrainingValue.CATERING)
      .selectInPrisonTraining(InPrisonTrainingValue.OTHER)
      .setInPrisonTrainingOther('Art and craft')
      .submitPage()

    // Then
    Page.verifyOnPage(EducationAndTrainingPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(@.inPrisonInterests.inPrisonTrainingInterests.size() == 2 && ' +
              "@.inPrisonInterests.inPrisonTrainingInterests[0].trainingType == 'CATERING' && " +
              '!@.inPrisonInterests.inPrisonTrainingInterests[0].trainingTypeOther && ' +
              "@.inPrisonInterests.inPrisonTrainingInterests[1].trainingType == 'OTHER' && " +
              "@.inPrisonInterests.inPrisonTrainingInterests[1].trainingTypeOther == 'Art and craft')]",
          ),
        ),
    )
  })

  it('should not update in-prison training interests given page submitted with validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/in-prison-training`)
    let inPrisonTrainingPage = Page.verifyOnPage(InPrisonTrainingPage)

    // When
    inPrisonTrainingPage //
      .selectInPrisonTraining(InPrisonTrainingValue.OTHER)
      .clearInPrisonTrainingOther()
      .submitPage()

    // Then
    inPrisonTrainingPage = Page.verifyOnPage(InPrisonTrainingPage)
    inPrisonTrainingPage.hasFieldInError('inPrisonTrainingOther')
    cy.wiremockVerifyNoInteractions(putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)))
  })

  it('should not update in-prison training interests given page submitted with no values', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/in-prison-training`)
    let inPrisonTrainingPage = Page.verifyOnPage(InPrisonTrainingPage)

    // When
    inPrisonTrainingPage //
      .deSelectInPrisonTraining(InPrisonTrainingValue.MACHINERY_TICKETS)
      .submitPage()

    // Then
    inPrisonTrainingPage = Page.verifyOnPage(InPrisonTrainingPage)
    inPrisonTrainingPage.hasErrorCount(1)
    inPrisonTrainingPage.hasFieldInError('inPrisonTraining')
    cy.wiremockVerifyNoInteractions(putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)))
  })

  it('should update in-prison training interests given induction created with the original long question set which did not ask about in-prison training interests', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.task('stubGetOriginalQuestionSetInduction', { questionSet: 'LONG' }) // The original long question set Induction did not ask about in-prison training interests
    cy.visit(`/plan/${prisonNumber}/view/education-and-training`)
    Page.verifyOnPage(EducationAndTrainingPage) //
      .inPrisonTrainingChangeLinkHasText('Add')
      .clickToChangeInPrisonTraining()

    // When
    Page.verifyOnPage(InPrisonTrainingPage)
      .selectInPrisonTraining(InPrisonTrainingValue.CATERING)
      .selectInPrisonTraining(InPrisonTrainingValue.OTHER)
      .setInPrisonTrainingOther('Art and craft')
      .submitPage()

    // Then
    Page.verifyOnPage(EducationAndTrainingPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(@.inPrisonInterests.inPrisonTrainingInterests.size() == 2 && ' +
              "@.inPrisonInterests.inPrisonTrainingInterests[0].trainingType == 'CATERING' && " +
              '!@.inPrisonInterests.inPrisonTrainingInterests[0].trainingTypeOther && ' +
              "@.inPrisonInterests.inPrisonTrainingInterests[1].trainingType == 'OTHER' && " +
              "@.inPrisonInterests.inPrisonTrainingInterests[1].trainingTypeOther == 'Art and craft')]",
          ),
        ),
    )
  })
})
