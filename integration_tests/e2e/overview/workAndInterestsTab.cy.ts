import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'
import WorkAndInterestsPage from '../../pages/overview/WorkAndInterestsPage'
import SkillsPage from '../../pages/induction/SkillsPage'
import WorkedBeforePage from '../../pages/induction/WorkedBeforePage'
import PreviousWorkExperienceDetailPage from '../../pages/induction/PreviousWorkExperienceDetailPage'
import TypeOfWorkExperienceValue from '../../../server/enums/typeOfWorkExperienceValue'
import FutureWorkInterestTypesPage from '../../pages/induction/FutureWorkInterestTypesPage'
import FutureWorkInterestRolesPage from '../../pages/induction/FutureWorkInterestRolesPage'
import PreviousWorkExperienceTypesPage from '../../pages/induction/PreviousWorkExperienceTypesPage'
import InPrisonWorkPage from '../../pages/induction/InPrisonWorkPage'
import HopingToWorkOnReleasePage from '../../pages/induction/HopingToWorkOnReleasePage'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'
import HasWorkedBeforeValue from '../../../server/enums/hasWorkedBeforeValue'
import AuthorisationErrorPage from '../../pages/authorisationError'

context('Prisoner Overview page - Work and Interests tab', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithViewAuthority')
    cy.task('stubAuthUser')
    cy.task('stubGetHeaderComponent')
    cy.task('stubGetFooterComponent')
    cy.task('stubPrisonerList')
    cy.task('stubCiagInductionList')
    cy.task('stubActionPlansList')
    cy.task('getPrisonerById')
    cy.task('stubGetInduction')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('getActionPlan')
  })

  it('should display Work and interests data given the person answered that they want to work during Induction', () => {
    // Given
    cy.task('stubGetInduction', { hopingToGetWork: HopingToGetWorkValue.YES })

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
      .hasWorkExperienceDisplayed()
      .hasWorkInterestsDisplayed()
      .hasInPrisonWorkInterestsSummaryCardDisplayed()
      .hasSkillsAndInterestsDisplayed()
  })

  it('should display Work and interests data given the person answered that they do not want to work during Induction', () => {
    // Given
    cy.task('stubGetInduction', { hopingToGetWork: HopingToGetWorkValue.NO })

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
      .hasWorkExperienceDisplayed()
      .hasWorkInterestsDisplayed()
      .hasInPrisonWorkInterestsSummaryCardDisplayed()
      .hasSkillsAndInterestsDisplayed()
  })

  it('should display Induction unavailable message given PLP API is unavailable when retrieving the Induction', () => {
    // Given
    cy.signIn()

    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // Stub a PLP API 500 error *after* rendering the overview page. The scenario here is that the user has signed in and
    // displayed the Prisoner List and Overview screens, but between displaying the Overview and clicking on
    // 'Work and interests' the PLP API has gone done.
    cy.task('stubGetInduction500Error')

    // When
    overviewPage.selectTab('Work and interests')
    const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

    // Then
    workAndInterestsPage //
      .activeTabIs('Work and interests')
      .hasInductionUnavailableMessageDisplayed()
  })

  it('should display link to create Induction given prisoner does not have an Induction yet', () => {
    // Given
    cy.task('stubGetInduction404Error')

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
      .hasLinkToCreateInductionDisplayed()
  })

  describe(`link to change Induction 'Hoping to work on release' question`, () => {
    it(`should link to change Induction 'Hoping to work on release' question for users with edit authority`, () => {
      // Given
      cy.task('stubSignInAsUserWithEditAuthority')
      cy.task('stubGetInduction')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickHopingToWorkOnReleaseChangeLink()

      // Then
      Page.verifyOnPage(HopingToWorkOnReleasePage)
    })

    it(`should link to auth-error page for users with read-only authority`, () => {
      // Given
      cy.task('stubGetInduction')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickHopingToWorkOnReleaseChangeLinkReadOnlyUser()

      // Then
      Page.verifyOnPage(AuthorisationErrorPage)
    })
  })

  describe(`link to change Induction 'Skills' question`, () => {
    it(`should link to change Induction 'Skills' question for users with edit authority`, () => {
      // Given
      cy.task('stubSignInAsUserWithEditAuthority')
      cy.task('stubGetInduction')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickSkillsChangeLink()

      // Then
      Page.verifyOnPage(SkillsPage)
    })

    it(`should link to auth-error page for users with read-only authority`, () => {
      // Given
      cy.task('stubGetInduction')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickPersonalInterestsChangeLinkReadOnlyUser()

      // Then
      Page.verifyOnPage(AuthorisationErrorPage)
    })
  })

  describe(`link to change Induction 'Worked Before' question`, () => {
    it(`should link to change Induction 'Worked Before' question for users with edit authority`, () => {
      // Given
      cy.task('stubSignInAsUserWithEditAuthority')
      cy.task('stubGetInduction')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickWorkedBeforeChangeLink()

      // Then
      Page.verifyOnPage(WorkedBeforePage)
    })

    it(`should link to auth-error page for users with read-only authority`, () => {
      // Given
      cy.task('stubGetInduction')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickAffectAbilityToWorkChangeLinkReadOnlyUser()

      // Then
      Page.verifyOnPage(AuthorisationErrorPage)
    })
  })

  describe(`link to change Induction 'Previous Work Experience Types' question`, () => {
    it(`should link to change Induction 'Previous Work Experience Types' question given person has worked before and user has edit authority`, () => {
      // Given
      cy.task('stubSignInAsUserWithEditAuthority')
      cy.task('stubGetInduction', { hasWorkedBefore: HasWorkedBeforeValue.YES }) // Induction has previous work experiences of Office and Other

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickPreviousWorkExperienceTypesChangeLink()

      // Then
      const previousWorkExperienceTypesPage = Page.verifyOnPage(PreviousWorkExperienceTypesPage)
      previousWorkExperienceTypesPage //
        .hasPreviousWorkExperiences([TypeOfWorkExperienceValue.OFFICE, TypeOfWorkExperienceValue.OTHER])
        .hasOtherPreviousWorkExperienceType('Finance')
    })

    it(`should link to auth-error page given user has read-only authority`, () => {
      // Given
      cy.task('stubGetInduction', { hasWorkedBefore: HasWorkedBeforeValue.YES }) // Induction has previous work experiences of Office and Other

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickPreviousWorkExperienceTypesChangeLinkReadOnlyUser()

      // Then
      Page.verifyOnPage(AuthorisationErrorPage)
    })
  })

  describe(`link to change Induction 'Previous Work Experience Detail' question`, () => {
    it(`should link to change Induction 'Previous Work Experience Detail' question given person has worked before and user has edit authority`, () => {
      // Given
      cy.task('stubSignInAsUserWithEditAuthority')
      cy.task('stubGetInduction', { hasWorkedBefore: HasWorkedBeforeValue.YES }) // Induction has previous work experiences of Office and Other

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickPreviousWorkExperienceDetailChangeLink(TypeOfWorkExperienceValue.OFFICE)

      // Then
      Page.verifyOnPage(PreviousWorkExperienceDetailPage)
    })

    it(`should link to auth-error page given user has read-only authority`, () => {
      // Given
      cy.task('stubGetInduction', { hasWorkedBefore: HasWorkedBeforeValue.YES }) // Induction has previous work experiences of Office and Other

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickPreviousWorkExperienceDetailChangeLinkReadOnlyUser(TypeOfWorkExperienceValue.OFFICE)

      // Then
      Page.verifyOnPage(AuthorisationErrorPage)
    })
  })

  describe(`link to change Induction 'Future Work Interest Types' question`, () => {
    it(`should link to change Induction 'Future Work Interest Types' question given person does want to work and user has edit authority`, () => {
      // Given
      cy.task('stubSignInAsUserWithEditAuthority')
      cy.task('stubGetInduction', { hopingToGetWork: HopingToGetWorkValue.YES })

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickFutureWorkInterestTypesChangeLink()

      // Then
      Page.verifyOnPage(FutureWorkInterestTypesPage)
    })

    it(`should link to auth-error page given user has read-only authority`, () => {
      // Given
      cy.task('stubGetInduction', { hopingToGetWork: HopingToGetWorkValue.YES })

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickFutureWorkInterestTypesChangeLinkReadOnlyUser()

      // Then
      Page.verifyOnPage(AuthorisationErrorPage)
    })
  })

  describe(`link to change Induction 'Future Work Interest Roles' question`, () => {
    it(`should link to change Induction 'Future Work Interest Roles' question given person does want to work and user has edit authority`, () => {
      // Given
      cy.task('stubSignInAsUserWithEditAuthority')
      cy.task('stubGetInduction', { hopingToGetWork: HopingToGetWorkValue.YES })

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickFutureWorkInterestRolesChangeLink()

      // Then
      Page.verifyOnPage(FutureWorkInterestRolesPage)
    })

    it(`should link to auth-error page given user has read-only authority`, () => {
      // Given
      cy.task('stubGetInduction', { hopingToGetWork: HopingToGetWorkValue.YES })

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickFutureWorkInterestRolesChangeLinkReadOnlyUser()

      // Then
      Page.verifyOnPage(AuthorisationErrorPage)
    })
  })

  it(`should not link to change Induction 'Future Work Interest Types' question given person does not want to work and user has edit authority`, () => {
    // Given
    cy.task('stubSignInAsUserWithEditAuthority')
    cy.task('stubGetInduction', { hopingToGetWork: HopingToGetWorkValue.NO })

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
    const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

    // Then
    workAndInterestsPage.doesNotHaveFutureWorkInterestRolesChangeLink()
  })

  it(`should not link to change Induction 'Future Work Interest Roles' question given person does not want to work and user has read-only authority`, () => {
    // Given
    cy.task('stubGetInduction', { hopingToGetWork: HopingToGetWorkValue.NO })

    cy.signIn()
    const prisonNumber = 'G6115VJ'
    cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
    const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

    // Then
    workAndInterestsPage.doesNotHaveFutureWorkInterestRolesChangeLink()
  })

  describe(`link to change Induction 'In Prison Work' question`, () => {
    it(`should link to change Induction 'In Prison Work' question for users with edit authority`, () => {
      // Given
      cy.task('stubSignInAsUserWithEditAuthority')
      cy.task('stubGetInduction')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickInPrisonWorkChangeLink()

      // Then
      Page.verifyOnPage(InPrisonWorkPage)
    })

    it(`should link to auth-error page given user has read-only authority`, () => {
      // Given
      cy.task('stubGetInduction')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickInPrisonWorkChangeLinkReadOnlyUser()

      // Then
      Page.verifyOnPage(AuthorisationErrorPage)
    })
  })
})
