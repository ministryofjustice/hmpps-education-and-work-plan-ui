import OverviewPage from '../../pages/overview/OverviewPage'
import Page from '../../pages/page'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'
import QualificationsListPage from '../../pages/induction/QualificationsListPage'

context('Create a long question set Induction', () => {
  beforeEach(() => {
    cy.signInAsUserWithEditAuthorityToArriveOnPrisonerListPage()
  })

  it('should create a long question set Induction', () => {
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
    const hopingToWorkOnReleasePage = overviewPage //
      .clickMakeProgressPlan()
      .hasBackLinkTo('/plan/A00001A/view/overview')
    // submit the page without answering the question to trigger a validation error
    hopingToWorkOnReleasePage.submitPage()
    hopingToWorkOnReleasePage //
      .hasErrorCount(1)
      .hasFieldInError('hopingToGetWork')
    // Answer the question and submit the page
    hopingToWorkOnReleasePage //
      .selectHopingWorkOnRelease(HopingToGetWorkValue.YES)
      .submitPage()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const qualificationsListPage = Page.verifyOnPage(QualificationsListPage) //
      .hasBackLinkTo('/prisoners/A00001A/create-induction/hoping-to-work-on-release')

    // Then
  })
})
