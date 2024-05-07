import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'
import HopingToWorkOnReleasePage from '../../pages/induction/HopingToWorkOnReleasePage'
import ReasonsNotToGetWorkPage from '../../pages/induction/ReasonsNotToGetWorkPage'
import ReasonNotToGetWorkValue from '../../../server/enums/reasonNotToGetWorkValue'
import WantToAddQualificationsPage from '../../pages/induction/WantToAddQualificationsPage'
import YesNoValue from '../../../server/enums/yesNoValue'

context('Create a short question set Induction', () => {
  beforeEach(() => {
    cy.signInAsUserWithEditAuthorityToArriveOnPrisonerListPage()
  })

  it('should create a short question set Induction', () => {
    // Given
    const prisonNumberForPrisonerWithNoInduction = 'A00001A'
    cy.task('getActionPlan', prisonNumberForPrisonerWithNoInduction)
    cy.task('getPrisonerById', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerProfile', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubLearnerEducation', prisonNumberForPrisonerWithNoInduction)
    cy.task('stubGetInduction404Error', prisonNumberForPrisonerWithNoInduction)
    cy.visit(`/plan/${prisonNumberForPrisonerWithNoInduction}/view/overview`)

    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.clickMakeProgressPlan()
    Page.verifyOnPage(HopingToWorkOnReleasePage) //
      .hasBackLinkTo('/plan/A00001A/view/overview')
      .submitPage() // submit the page without answering the question to trigger a validation error
    Page.verifyOnPage(HopingToWorkOnReleasePage) //
      .hasBackLinkTo('/plan/A00001A/view/overview')
      .hasErrorCount(1)
      .hasFieldInError('hopingToGetWork')
      .selectHopingWorkOnRelease(HopingToGetWorkValue.NO)
      .submitPage()
    Page.verifyOnPage(ReasonsNotToGetWorkPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/hoping-to-work-on-release')
      .chooseReasonNotToGetWork(ReasonNotToGetWorkValue.HEALTH)
      .chooseReasonNotToGetWork(ReasonNotToGetWorkValue.FULL_TIME_CARER)
      .submitPage()
    Page.verifyOnPage(WantToAddQualificationsPage)
      .hasBackLinkTo('/prisoners/A00001A/create-induction/reasons-not-to-get-work')
      .selectHopingWorkOnRelease(YesNoValue.NO)
    // Then
  })
})
