import Page from '../../pages/page'
import OverviewPage from '../../pages/overview/OverviewPage'
import InductionScheduleStatusValue from '../../../server/enums/inductionScheduleStatusValue'

context('Prisoner Overview page - Pre Induction', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignInAsUserWithManagerRole')
    cy.task('getPrisonerById')
    cy.task('stubGetInduction')
    cy.task('getActionPlan')
  })

  const prisonNumber = 'G6115VJ'

  it('should render prisoner Overview page with Create Induction panel given Induction can be created', () => {
    // Given
    cy.signIn()
    cy.task('stubGetInduction404Error')
    cy.task('stubGetInductionSchedule', {
      scheduleStatus: InductionScheduleStatusValue.SCHEDULED,
    })

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPreInduction()
      .inductionIsNotPendingScreeningAndAssessments()
      .inductionCanBeCreated()
  })

  it('should render prisoner Overview page with Induction Pending S&As panel given Induction is pending the screenings and assessments', () => {
    // Given
    cy.signIn()
    cy.task('stubGetInduction404Error')
    cy.task('stubGetInductionSchedule', {
      scheduleStatus: InductionScheduleStatusValue.PENDING_INITIAL_SCREENING_AND_ASSESSMENTS_FROM_CURIOUS,
    })

    // When
    cy.visit(`/plan/${prisonNumber}/view/overview`)

    // Then
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage //
      .isForPrisoner(prisonNumber)
      .isPreInduction()
      .inductionIsPendingScreeningAndAssessments()
      .inductionCannotBeCreated()
  })
})
