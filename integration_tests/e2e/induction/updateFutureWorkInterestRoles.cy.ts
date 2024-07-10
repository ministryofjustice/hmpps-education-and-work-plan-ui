import Page from '../../pages/page'
import FutureWorkInterestRolesPage from '../../pages/induction/FutureWorkInterestRolesPage'
import WorkAndInterestsPage from '../../pages/overview/WorkAndInterestsPage'
import WorkInterestTypeValue from '../../../server/enums/workInterestTypeValue'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'

context('Update future work interest roles within an Induction', () => {
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

  it('should update work interest roles', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/work-interest-roles`)
    const futureWorkInterestRolesPage = Page.verifyOnPage(FutureWorkInterestRolesPage)

    // When
    futureWorkInterestRolesPage //
      .setWorkInterestRole(WorkInterestTypeValue.WASTE_MANAGEMENT, 'Bin person') // changed from Bin man
      .setWorkInterestRole(WorkInterestTypeValue.CONSTRUCTION, 'Bricklayer')
      .setWorkInterestRole(WorkInterestTypeValue.OTHER, 'Solar panel installer')
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(@.futureWorkInterests.interests.size() == 3 && ' +
              "@.futureWorkInterests.interests[0].workType == 'WASTE_MANAGEMENT' && " +
              "@.futureWorkInterests.interests[0].role == 'Bin person' && " +
              "@.futureWorkInterests.interests[1].workType == 'CONSTRUCTION' && " +
              "@.futureWorkInterests.interests[1].role == 'Bricklayer' && " +
              "@.futureWorkInterests.interests[2].workType == 'OTHER' && " +
              "@.futureWorkInterests.interests[2].role == 'Solar panel installer')]",
          ),
        ),
    )
  })
})
