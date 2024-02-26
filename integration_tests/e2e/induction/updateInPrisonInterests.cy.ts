import Page from '../../pages/page'
import InPrisonWorkPage from '../../pages/induction/InPrisonWorkPage'
import InPrisonWorkValue from '../../../server/enums/inPrisonWorkValue'
import EducationAndTrainingPage from '../../pages/overview/EducationAndTrainingPage'
import AuthorisationErrorPage from '../../pages/authorisationError'
import Error404Page from '../../pages/error404'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context('Update in-prison interests within an Induction', () => {
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
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
  })

  describe('update in-prison work within an Induction', () => {
    beforeEach(() => {
      cy.task('stubGetInductionShortQuestionSet')
      cy.task('stubUpdateInduction')
      cy.signIn()
    })

    it('should update in-prison work given page submitted with no validation errors', () => {
      // Given
      const prisonNumber = 'G6115VJ'
      cy.visit(`/prisoners/${prisonNumber}/induction/in-prison-work`)
      const inPrisonWorkPage = Page.verifyOnPage(InPrisonWorkPage)

      // When
      inPrisonWorkPage //
        .chooseWorkType(InPrisonWorkValue.CLEANING_AND_HYGIENE)
        .chooseWorkType(InPrisonWorkValue.OTHER)
        .setOtherWorkType('Painting and decorating')
        .submitPage()

      // Then
      Page.verifyOnPage(EducationAndTrainingPage)
      cy.wiremockVerify(
        putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
          .withRequestBody(
            matchingJsonPath(
              '$[?(@.inPrisonInterests.inPrisonWorkInterests.size() == 3 && ' +
                "@.inPrisonInterests.inPrisonWorkInterests[0].workType == 'CLEANING_AND_HYGIENE' && !@.inPrisonInterests.inPrisonWorkInterests[0].workTypeOther && " +
                "@.inPrisonInterests.inPrisonWorkInterests[1].workType == 'MAINTENANCE' && !@.inPrisonInterests.inPrisonWorkInterests[1].workTypeOther && " +
                "@.inPrisonInterests.inPrisonWorkInterests[2].workType == 'OTHER' && @.inPrisonInterests.inPrisonWorkInterests[2].workTypeOther == 'Painting and decorating')]",
            ),
          ),
      )
    })

    it('should not update in-prison work given page submitted with validation errors', () => {
      // Given
      const prisonNumber = 'G6115VJ'
      cy.visit(`/prisoners/${prisonNumber}/induction/in-prison-work`)
      let inPrisonWorkPage = Page.verifyOnPage(InPrisonWorkPage)

      // When
      inPrisonWorkPage //
        .chooseWorkType(InPrisonWorkValue.OTHER)
        .clearOtherWorkType()
        .submitPage()

      // Then
      inPrisonWorkPage = Page.verifyOnPage(InPrisonWorkPage)
      inPrisonWorkPage.hasFieldInError('inPrisonWorkOther')
      cy.wiremockVerifyNoInteractions(putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)))
    })
  })
})
