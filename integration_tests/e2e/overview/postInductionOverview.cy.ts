import { v4 as uuidv4 } from 'uuid'
import Page from '../../pages/page'
import CreateGoalsPage from '../../pages/goal/CreateGoalsPage'
import OverviewPage from '../../pages/overview/OverviewPage'
import { aValidGoalResponse } from '../../../server/testsupport/actionPlanResponseTestDataBuilder'
import GoalStatusValue from '../../../server/enums/goalStatusValue'

context('Prisoner Overview page - Post Induction', () => {
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
    cy.task('stubGetInduction')
    cy.task('retrieveGoals')
    cy.task('stubLearnerProfile')
    cy.task('stubLearnerEducation')
    cy.task('retrieveGoals500')
  })

  it('should render prisoner Overview page with Add Goal button given user has edit authority', () => {
    // Given
    cy.task('stubSignInAsUserWithEditAuthority')

    const prisonNumber = 'G6115VJ'

    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPostInduction()
      .hasAddGoalButtonDisplayed()
      .activeTabIs('Overview')
      .printThisPageIsPresent()
  })

  it('should render prisoner Overview page without Add Goal and Update Goal buttons given user does not have edit authority', () => {
    // Given
    cy.task('stubSignInAsUserWithViewAuthority')

    const prisonNumber = 'G6115VJ'
    cy.signIn()

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPostInduction()
      .doesNotHaveAddGoalButton()
      .doesNotHaveUpdateGoalButtons()
      .activeTabIs('Overview')
  })

  it('should display prisoner Goals', () => {
    // Given
    cy.task('stubSignInAsUserWithViewAuthority')

    cy.signIn()
    const prisonNumber = 'G6115VJ'

    cy.task('retrieveGoals', {
      status: GoalStatusValue.ACTIVE,
      goals: [aValidGoalResponse()],
    })

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPostInduction()
      .activeTabIs('Overview')
      .hasNumberOfGoals(1)
      .hasGoalNotesExpander()
  })

  it('should display prisoner Goals in order of target date, soonest first', () => {
    // Given
    cy.task('stubSignInAsUserWithViewAuthority')

    cy.signIn()
    const prisonNumber = 'G6115VJ'

    const aGoalThatIsDueLater = {
      ...aValidGoalResponse(),
      goalReference: uuidv4(),
      title: 'I am due later',
      targetCompletionDate: '2025-01-01T00:00:00.000Z',
    }
    const aGoalThatIsDueSooner = {
      ...aValidGoalResponse(),
      goalReference: uuidv4(),
      title: 'I am due sooner',
      targetCompletionDate: '2024-12-25T00:00:00.000Z',
    }
    const aGoalThatIsDueSometimeBetween = {
      ...aValidGoalResponse(),
      goalReference: uuidv4(),
      title: 'I am due sometime between the others',
      targetCompletionDate: '2024-12-29T00:00:00.000Z',
    }
    cy.task('retrieveGoals', {
      status: GoalStatusValue.ACTIVE,
      goals: [aGoalThatIsDueLater, aGoalThatIsDueSooner, aGoalThatIsDueSometimeBetween],
    })

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const poverviewPage = Page.verifyOnPage(OverviewPage)
    poverviewPage //
      .isForPrisoner(prisonNumber)
      .isPostInduction()
      .activeTabIs('Overview')
      .hasNumberOfGoals(3)
      .goalSummaryCardAtPositionContains(1, aGoalThatIsDueSooner.title)
      .goalSummaryCardAtPositionContains(2, aGoalThatIsDueSometimeBetween.title)
      .goalSummaryCardAtPositionContains(3, aGoalThatIsDueLater.title)
  })

  it('should display goals section given prisoner has no goals', () => {
    // Given
    cy.task('stubSignInAsUserWithViewAuthority')
    cy.task('retrieveGoals404')

    cy.signIn()
    const prisonNumber = 'G6115VJ'

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPostInduction()
      .activeTabIs('Overview')
      .hasEmptyGoalsSection()
      .hasNoServiceUnavailableMessageDisplayed()
  })

  it('should display service unavailable message given EWP API returns a 500', () => {
    // Given
    cy.task('stubSignInAsUserWithViewAuthority')

    cy.signIn()
    const prisonNumber = 'G6115VJ'

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    cy.task('retrieveGoals500')

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPostInduction()
      .activeTabIs('Overview')
      .hasServiceUnavailableMessageDisplayed()
  })

  it('should navigate to Create Goal page given Add A Goal button is clicked', () => {
    // Given
    const prisonNumber = 'G6115VJ'
    cy.signIn()
    cy.visit(`/plan/${prisonNumber}/view/overview`)
    const overviewPage = Page.verifyOnPage(OverviewPage)

    // When
    overviewPage.clickAddGoalButton()

    // Then
    Page.verifyOnPage(CreateGoalsPage)
  })
})
