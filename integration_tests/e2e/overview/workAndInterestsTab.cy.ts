import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'
import WorkAndInterestsPage from '../../pages/overview/WorkAndInterestsPage'

context('Prisoner Overview page - Work and Interests tab', () => {
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
    cy.task('stubGetShortQuestionSetCiagProfile')
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
  })

  it('should display Work and interests data given the long question set CIAG Induction was performed', () => {
    // Given
    cy.task('stubGetLongQuestionSetCiagProfile')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Work and interests')
    const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

    // Then
    workAndInterestsPage //
      .activeTabIs('Work and interests')
      .isShowingLongQuestionSetAnswers()
      .hasWorkInterests()
      .hasWorkExperienceDisplayed()
      .hasSkillsAndInterestsDisplayed()
  })

  it('should display Work and interests data given the short question set CIAG Induction was performed', () => {
    // Given
    cy.task('stubGetShortQuestionSetCiagProfile')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Work and interests')
    const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

    // Then
    workAndInterestsPage //
      .activeTabIs('Work and interests')
      .isShowingShortQuestionSetAnswers()
      .hasWorkInterests()
  })

  it('should display CIAG unavailable message given CIAG is unavailable', () => {
    // Given
    cy.signIn()

    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // Stub a CIAG 500 error *after* rendering the overview page. The scenario here is that the user has signed in and
    // displayed the Prisoner List and Overview screens, but between displaying the Overview and clicking on
    // 'Work and interests' the CIAG API has gone done.
    cy.task('stubGetCiagProfile500Error')

    // When
    overviewPage.selectTab('Work and interests')
    const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

    // Then
    workAndInterestsPage //
      .activeTabIs('Work and interests')
      .hasCiagInductionApiUnavailableMessageDisplayed()
  })

  it('should display link to create CIAG Induction given prisoner does not have a CIAG Induction yet', () => {
    // Given
    cy.task('stubGetCiagProfile404Error')

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.selectTab('Work and interests')
    const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

    // Then
    workAndInterestsPage //
      .activeTabIs('Work and interests')
      .hasLinkToCreateCiagInductionDisplayed()
  })
})
