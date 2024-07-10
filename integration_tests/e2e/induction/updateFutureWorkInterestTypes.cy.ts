import Page from '../../pages/page'
import FutureWorkInterestTypesPage from '../../pages/induction/FutureWorkInterestTypesPage'
import WorkAndInterestsPage from '../../pages/overview/WorkAndInterestsPage'
import WorkInterestTypeValue from '../../../server/enums/workInterestTypeValue'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context('Update future work interest types within an Induction', () => {
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
    cy.task('stubUpdateInduction')
    cy.task('stubGetInduction')
    cy.signIn()
  })

  it('should update work interest types given page submitted with changed values and no validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/work-interest-types`)
    const futureWorkInterestTypesPage = Page.verifyOnPage(FutureWorkInterestTypesPage)

    // When
    futureWorkInterestTypesPage //
      .selectWorkInterestType(WorkInterestTypeValue.WASTE_MANAGEMENT)
      .selectWorkInterestType(WorkInterestTypeValue.OTHER)
      .setWorkInterestTypesOther('Renewable energy')
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(@.futureWorkInterests.interests.size() == 3 && ' +
              "@.futureWorkInterests.interests[0].workType == 'CONSTRUCTION' && " +
              '!@.futureWorkInterests.interests[0].role && ' +
              '!@.futureWorkInterests.interests[0].workTypeOther && ' +
              "@.futureWorkInterests.interests[1].workType == 'WASTE_MANAGEMENT' && " +
              "@.futureWorkInterests.interests[1].role == 'Bin man' && " +
              '!@.futureWorkInterests.interests[1].workTypeOther && ' +
              "@.futureWorkInterests.interests[2].workType == 'OTHER' && " +
              '!@.futureWorkInterests.interests[2].role && ' +
              "@.futureWorkInterests.interests[2].workTypeOther == 'Renewable energy')]",
          ),
        ),
    )
  })

  it('should not update work interest types given page submitted with validation errors', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/work-interest-types`)
    let futureWorkInterestTypesPage = Page.verifyOnPage(FutureWorkInterestTypesPage)

    // When
    futureWorkInterestTypesPage //
      .selectWorkInterestType(WorkInterestTypeValue.OTHER)
      .clearWorkInterestTypesOther()
      .submitPage()

    // Then
    futureWorkInterestTypesPage = Page.verifyOnPage(FutureWorkInterestTypesPage)
    futureWorkInterestTypesPage.hasFieldInError('workInterestTypesOther')
    cy.wiremockVerifyNoInteractions(putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)))
  })
})
