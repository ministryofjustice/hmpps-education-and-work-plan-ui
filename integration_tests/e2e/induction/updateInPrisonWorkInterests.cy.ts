import Page from '../../pages/page'
import InPrisonWorkPage from '../../pages/induction/InPrisonWorkPage'
import InPrisonWorkValue from '../../../server/enums/inPrisonWorkValue'
import WorkAndInterestsPage from '../../pages/overview/WorkAndInterestsPage'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context('Update in-prison work interests within an Induction', () => {
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
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('stubGetInduction')
    cy.task('stubUpdateInduction')
    cy.signIn()
  })

  it('should update in-prison work given page submitted with no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/in-prison-work`)
    const inPrisonWorkPage = Page.verifyOnPage(InPrisonWorkPage)
      .hasBackLinkTo(`/plan/${prisonNumber}/view/work-and-interests`)
      .backLinkHasAriaLabel(`Back to Daniel Craig's learning and work progress`)

    // When
    inPrisonWorkPage //
      .selectWorkType(InPrisonWorkValue.CLEANING_AND_HYGIENE)
      .selectWorkType(InPrisonWorkValue.OTHER)
      .setOtherWorkType('Painting and decorating')
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
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
      .selectWorkType(InPrisonWorkValue.OTHER)
      .clearOtherWorkType()
      .submitPage()

    // Then
    inPrisonWorkPage = Page.verifyOnPage(InPrisonWorkPage)
    inPrisonWorkPage.hasFieldInError('inPrisonWorkOther')
    cy.wiremockVerifyNoInteractions(putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)))
  })

  it('should update in-prison work interests given induction created with the original long question set which did not ask about in-prison work interests', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.task('stubGetOriginalQuestionSetInduction', { questionSet: 'LONG' }) // The original long question set Induction did not ask about in-prison work interests
    cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
    Page.verifyOnPage(WorkAndInterestsPage) //
      .inPrisonWorkChangeLinkHasText('Add')
      .clickInPrisonWorkChangeLink()

    // When
    Page.verifyOnPage(InPrisonWorkPage)
      .selectWorkType(InPrisonWorkValue.CLEANING_AND_HYGIENE)
      .selectWorkType(InPrisonWorkValue.OTHER)
      .setOtherWorkType('Painting and decorating')
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(@.inPrisonInterests.inPrisonWorkInterests.size() == 2 && ' +
              "@.inPrisonInterests.inPrisonWorkInterests[0].workType == 'CLEANING_AND_HYGIENE' && !@.inPrisonInterests.inPrisonWorkInterests[0].workTypeOther && " +
              "@.inPrisonInterests.inPrisonWorkInterests[1].workType == 'OTHER' && @.inPrisonInterests.inPrisonWorkInterests[1].workTypeOther == 'Painting and decorating')]",
          ),
        ),
    )
  })
})
