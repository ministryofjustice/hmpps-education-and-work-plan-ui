import Page from '../../pages/page'
import HopingToWorkOnReleasePage from '../../pages/induction/HopingToWorkOnReleasePage'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'
import { putRequestedFor } from '../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../mockApis/wiremock/matchers/content'
import WorkAndInterestsPage from '../../pages/overview/WorkAndInterestsPage'
import FutureWorkInterestTypesPage from '../../pages/induction/FutureWorkInterestTypesPage'
import WorkInterestTypeValue from '../../../server/enums/workInterestTypeValue'
import FutureWorkInterestRolesPage from '../../pages/induction/FutureWorkInterestRolesPage'

context('Update Hoping to work on release within an Induction', () => {
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
    cy.task('stubUpdateInduction')
    cy.signIn()
  })

  it(`should update Induction from hoping to work Yes to hoping to work No`, () => {
    // Given
    cy.task('stubGetInduction', { hopingToGetWork: HopingToGetWorkValue.YES })

    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`)
    const hopingToWorkOnReleasePage = Page.verifyOnPage(HopingToWorkOnReleasePage)

    // When
    hopingToWorkOnReleasePage //
      .hasBackLinkTo(`/plan/${prisonNumber}/view/work-and-interests`)
      .selectHopingWorkOnRelease(HopingToGetWorkValue.NO)
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath("$[?(@.workOnRelease.hopingToWork == 'NO' && @.futureWorkInterests.interests.size() == 0)]"),
        ),
    )
  })

  it(`should update Induction from hoping to work No to hoping to work Yes`, () => {
    // Given
    cy.task('stubGetInduction', { hopingToGetWork: HopingToGetWorkValue.NO })

    const prisonNumber = 'G6115VJ'
    cy.visit(`/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`)
    const hopingToWorkOnReleasePage = Page.verifyOnPage(HopingToWorkOnReleasePage)

    // When
    hopingToWorkOnReleasePage //
      .hasBackLinkTo(`/plan/${prisonNumber}/view/work-and-interests`)
      .selectHopingWorkOnRelease(HopingToGetWorkValue.YES)
      .submitPage()
    Page.verifyOnPage(FutureWorkInterestTypesPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/hoping-to-work-on-release`)
      .selectWorkInterestType(WorkInterestTypeValue.CONSTRUCTION)
      .selectWorkInterestType(WorkInterestTypeValue.OTHER)
      .setWorkInterestTypesOther('Renewable energy')
      .submitPage()
    Page.verifyOnPage(FutureWorkInterestRolesPage)
      .hasBackLinkTo(`/prisoners/${prisonNumber}/induction/work-interest-types`)
      .setWorkInterestRole(WorkInterestTypeValue.CONSTRUCTION, 'Bricklayer')
      .setWorkInterestRole(WorkInterestTypeValue.OTHER, 'Solar panel installer')
      .submitPage()

    // Then
    Page.verifyOnPage(WorkAndInterestsPage)
    cy.wiremockVerify(
      putRequestedFor(urlEqualTo(`/inductions/${prisonNumber}`)) //
        .withRequestBody(
          matchingJsonPath(
            "$[?(@.workOnRelease.hopingToWork == 'YES' && " +
              '@.futureWorkInterests.interests.size() == 2 && ' +
              "@.futureWorkInterests.interests[0].workType == 'CONSTRUCTION' && " +
              "@.futureWorkInterests.interests[0].role == 'Bricklayer' && " +
              "@.futureWorkInterests.interests[1].workType == 'OTHER' && " +
              "@.futureWorkInterests.interests[1].role == 'Solar panel installer')]",
          ),
        ),
    )
  })
})
