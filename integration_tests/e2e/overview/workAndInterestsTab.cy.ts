import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'
import WorkAndInterestsPage from '../../pages/overview/WorkAndInterestsPage'
import SkillsPage from '../../pages/induction/SkillsPage'
import PersonalInterestsPage from '../../pages/induction/PersonalInterestsPage'
import WorkedBeforePage from '../../pages/induction/WorkedBeforePage'
import AffectAbilityToWorkPage from '../../pages/induction/AffectAbilityToWorkPage'
import PreviousWorkExperienceDetailPage from '../../pages/induction/PreviousWorkExperienceDetailPage'
import TypeOfWorkExperienceValue from '../../../server/enums/typeOfWorkExperienceValue'
import FutureWorkInterestTypesPage from '../../pages/induction/FutureWorkInterestTypesPage'
import FutureWorkInterestRolesPage from '../../pages/induction/FutureWorkInterestRolesPage'
import PreviousWorkExperienceTypesPage from '../../pages/induction/PreviousWorkExperienceTypesPage'
import InPrisonWorkPage from '../../pages/induction/InPrisonWorkPage'
import HopingToWorkOnReleasePage from '../../pages/induction/HopingToWorkOnReleasePage'
import HopingToGetWorkValue from '../../../server/enums/hopingToGetWorkValue'
import HasWorkedBeforeValue from '../../../server/enums/hasWorkedBeforeValue'

context('Prisoner Overview page - Work and Interests tab', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsReadOnlyUser')
    cy.task('stubAuthUser')
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

  it('should display link to create Induction given prisoner does not have an Induction yet and the user has an appropriate role', () => {
    // Given
    cy.task('stubSignInAsUserWithManagerRole')
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

  describe('should display change links to Induction questions given user has an appropriate role', () => {
    beforeEach(() => {
      cy.task('stubSignInAsUserWithManagerRole')
    })

    it(`should link to change Induction 'Hoping to work on release' question`, () => {
      // Given
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

    it(`should link to change Induction 'Skills' question`, () => {
      // Given
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

    it(`should link to change Induction 'Personal Interests' question`, () => {
      // Given
      cy.task('stubGetInduction')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickPersonalInterestsChangeLink()

      // Then
      Page.verifyOnPage(PersonalInterestsPage)
    })

    it(`should link to change Induction 'Worked Before' question`, () => {
      // Given
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

    it(`should link to change Induction 'Affect Ability To Work' question`, () => {
      // Given
      cy.task('stubGetInduction')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickAffectAbilityToWorkChangeLink()

      // Then
      Page.verifyOnPage(AffectAbilityToWorkPage)
    })

    it(`should link to change Induction 'Previous Work Experience Types' question given person has worked before`, () => {
      // Given
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

    it(`should link to change Induction 'Previous Work Experience Detail' question given person has worked before`, () => {
      // Given
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

    it(`should link to change Induction 'Future Work Interest Types' question given person does want to work`, () => {
      // Given
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

    it(`should link to change Induction 'Future Work Interest Roles' question given person does want to work`, () => {
      // Given
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

    it(`should not link to change Induction 'Future Work Interest Types' question given person does not want to work`, () => {
      // Given
      cy.task('stubGetInduction', { hopingToGetWork: HopingToGetWorkValue.NO })

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // Then
      workAndInterestsPage.doesNotHaveFutureWorkInterestRolesChangeLink()
    })

    it(`should not link to change Induction 'Future Work Interest Roles' question given person does not want to work`, () => {
      // Given
      cy.task('stubGetInduction', { hopingToGetWork: HopingToGetWorkValue.NO })

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // Then
      workAndInterestsPage.doesNotHaveFutureWorkInterestRolesChangeLink()
    })

    it(`should link to change Induction 'In Prison Work' question`, () => {
      // Given
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
  })
})
