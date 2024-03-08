import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'
import WorkAndInterestsPage from '../../pages/overview/WorkAndInterestsPage'
import SkillsPage from '../../pages/induction/SkillsPage'
import PersonalInterestsPage from '../../pages/induction/PersonalInterestsPage'
import WorkedBeforePage from '../../pages/induction/WorkedBeforePage'
import AffectAbilityToWorkPage from '../../pages/induction/AffectAbilityToWorkPage'
import ReasonsNotToGetWorkPage from '../../pages/induction/ReasonsNotToGetWorkPage'
import PreviousWorkExperienceDetailPage from '../../pages/induction/PreviousWorkExperienceDetailPage'
import TypeOfWorkExperienceValue from '../../../server/enums/typeOfWorkExperienceValue'
import FutureWorkInterestTypesPage from '../../pages/induction/FutureWorkInterestTypesPage'
import PreviousWorkExperienceTypesPage from '../../pages/induction/PreviousWorkExperienceTypesPage'

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
    cy.task('stubGetInductionShortQuestionSet')
    cy.task('getActionPlan')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
  })

  it('should display Work and interests data given the long question set Induction was performed', () => {
    // Given
    cy.task('stubGetInductionLongQuestionSet')

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

  it('should display Work and interests data given the short question set Induction was performed', () => {
    // Given
    cy.task('stubGetInductionShortQuestionSet')

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

  describe('should display change links to Induction questions', () => {
    it(`should link to change Induction 'Skills' question given long question set induction`, () => {
      // Given
      cy.task('stubGetInductionLongQuestionSet')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickSkillsChangeLink()

      // Then
      Page.verifyOnPage(SkillsPage)
    })

    it(`should link to change Induction 'Personal Interests' question given long question set induction`, () => {
      // Given
      cy.task('stubGetInductionLongQuestionSet')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickPersonalInterestsChangeLink()

      // Then
      Page.verifyOnPage(PersonalInterestsPage)
    })

    it(`should link to change Induction 'Worked Before' question given long question set induction`, () => {
      // Given
      cy.task('stubGetInductionLongQuestionSet')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickWorkedBeforeChangeLink()

      // Then
      Page.verifyOnPage(WorkedBeforePage)
    })

    it(`should link to change Induction 'Affect Ability To Work' question given long question set induction`, () => {
      // Given
      cy.task('stubGetInductionLongQuestionSet')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickAffectAbilityToWorkChangeLink()

      // Then
      Page.verifyOnPage(AffectAbilityToWorkPage)
    })

    it(`should link to change Induction 'Reasons Not To Get Work' question given short question set induction`, () => {
      // Given
      cy.task('stubGetInductionShortQuestionSet')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickReasonsNotToGetWorkWorkChangeLink()

      // Then
      Page.verifyOnPage(ReasonsNotToGetWorkPage)
    })

    it(`should link to change Induction 'Previous Work Experience Types' question given long question set induction`, () => {
      // Given
      cy.task('stubGetInductionLongQuestionSet') // Long question set induction has previous work experiences of Office and Other

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

    it(`should link to change Induction 'Previous Work Experience Detail' question given long question set induction`, () => {
      // Given
      cy.task('stubGetInductionLongQuestionSet') // Long question set induction has previous work experiences of Office and Other

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickPreviousWorkExperienceDetailChangeLink(TypeOfWorkExperienceValue.OFFICE)

      // Then
      Page.verifyOnPage(PreviousWorkExperienceDetailPage)
    })

    it(`should link to change Induction 'Future Work Interest Types' question given long question set induction`, () => {
      // Given
      cy.task('stubGetInductionLongQuestionSet')

      cy.signIn()
      const prisonNumber = 'G6115VJ'
      cy.visit(`/plan/${prisonNumber}/view/work-and-interests`)
      const workAndInterestsPage = Page.verifyOnPage(WorkAndInterestsPage)

      // When
      workAndInterestsPage.clickFutureWorkInterestTypesChangeLink()

      // Then
      Page.verifyOnPage(FutureWorkInterestTypesPage)
    })
  })
})
