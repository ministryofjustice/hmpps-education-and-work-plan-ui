import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import type { Goal } from 'viewModels'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidGoal } from '../../../testsupport/actionPlanTestDataBuilder'
import formatDateFilter from '../../../filters/formatDateFilter'
import formatStepStatusValueFilter from '../../../filters/formatStepStatusValueFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv.addFilter('formatDate', formatDateFilter).addFilter('formatStepStatusValue', formatStepStatusValueFilter)

const prisonerSummary = aValidPrisonerSummary('A1234GC')

describe('viewInProgressGoals', () => {
  const renderTemplate = (
    inProgressGoalsCount: number,
    archivedGoalsCount: number,
    goals: Goal[] = [],
    problemRetrievingData = false,
  ) => {
    return nunjucks.render('pages/overview/viewInProgressGoals.njk', {
      prisonerSummary,
      inProgressGoalsCount,
      archivedGoalsCount,
      goals,
      problemRetrievingData,
      activeTab: 'in-progress',
      tab: 'goals',
    })
  }

  it('should display the correct heading and prisoner banner', () => {
    // Given
    const content = renderTemplate(1, 1)
    const $ = cheerio.load(content)

    // When
    const pageHeadingText = $('[data-qa=page-heading]').text().trim()
    const prisonerName = $('[data-qa=prisoner-name]').text().trim()
    const prisonNumber = $('[data-qa=prison-number]').text().trim()
    const receptionDate = $('[data-qa=reception-date]').text().trim()
    const releaseDate = $('[data-qa=release-date]').text().trim()
    const dob = $('[data-qa=dob]').text().trim()

    // Then
    expect(pageHeadingText).toContain("Jimmy Lightfingers's learning and work progress")
    expect(prisonerName).toContain('Lightfingers, Jimmy')
    expect(prisonNumber).toContain('A1234GC')
    expect(receptionDate).toContain('29 Aug 1999')
    expect(releaseDate).toContain('31 Dec 2025')
    expect(dob).toContain('12 Feb 1969')
  })

  it('should display the correct tabs', () => {
    // Given
    const content = renderTemplate(1, 1)
    const $ = cheerio.load(content)

    // When
    const overviewTab = $('[data-qa=tab-overview]').text().trim()
    const goalsTab = $('[data-qa=tab-goals]').text().trim()
    const supportNeedsTab = $('[data-qa=tab-support-needs]').text().trim()
    const educationAndTrainingTab = $('[data-qa=tab-education-and-training]').text().trim()
    const workAndInterestsTab = $('[data-qa=tab-work-and-interests]').text().trim()
    const timelineTab = $('[data-qa=tab-timeline]').text().trim()

    // Then
    expect(overviewTab).toContain('Overview')
    expect(goalsTab).toContain('Goals')
    expect(supportNeedsTab).toContain('Support needs')
    expect(educationAndTrainingTab).toContain('Education and training')
    expect(workAndInterestsTab).toContain('Work and interests')
    expect(timelineTab).toContain('Timeline')
  })

  it('should display the in progress and archived goal sub tabs with correct number of goals', () => {
    // Given
    const content = renderTemplate(2, 2)
    const $ = cheerio.load(content)

    // When
    const inProgressTabText = $('[data-qa=in-progress-tab]').text().trim()
    const archivedTabText = $('[data-qa=archived-tab]').text().trim()

    // Then
    expect(inProgressTabText).toContain('In progress (2 goals)')
    expect(archivedTabText).toContain('Archived (2 goals)')
  })

  it('should correctly display "goal" when there is 1 goal', () => {
    // Given
    const content = renderTemplate(1, 1)
    const $ = cheerio.load(content)

    // When
    const inProgressTabText = $('[data-qa=in-progress-tab]').text().trim()
    const archivedTabText = $('[data-qa=archived-tab]').text().trim()

    // Then
    expect(inProgressTabText).toContain('In progress (1 goal)')
    expect(archivedTabText).toContain('Archived (1 goal)')
  })

  it('should display "no in progress goals" message when there are no in progress goals', () => {
    // Given
    const content = renderTemplate(0, 1)
    const $ = cheerio.load(content)

    // When
    const noInProgressGoalsMessage = $('[data-qa="no-in-progress-goals-message"]').text().trim()

    // Then
    expect(noInProgressGoalsMessage).toContain('Jimmy Lightfingers has no in progress goals')
  })

  it('should render the in-progress goals correctly with the correct content', () => {
    // Given
    const content = renderTemplate(2, 0, [aValidGoal(), aValidGoal({ title: 'Learn Italian' })])
    const $ = cheerio.load(content)

    // When
    const goalCards = $('[data-qa="goal-summary-card"]')
    const firstGoalCard = $(goalCards[0])
    const firstUpdateButton = firstGoalCard.find('[data-qa="goal-1-update-button"]')
    const firstArchiveButton = firstGoalCard.find('[data-qa="goal-1-archive-button"]')
    const secondGoalCard = $(goalCards[1])
    const secondUpdateButton = secondGoalCard.find('[data-qa="goal-2-update-button"]')
    const secondArchiveButton = secondGoalCard.find('[data-qa="goal-2-archive-button"]')

    // Then
    expect(goalCards.length).toEqual(2)
    expect(firstGoalCard.text()).toContain('Learn Spanish')
    expect(firstUpdateButton.text()).toContain('Update')
    expect(firstArchiveButton.text()).toContain('Archive')
    expect(secondGoalCard.text()).toContain('Learn Italian')
    expect(secondUpdateButton.text()).toContain('Update')
    expect(secondArchiveButton.text()).toContain('Archive')
  })

  it('should display Actions card', () => {
    // Given
    const content = renderTemplate(1, 1)
    const $ = cheerio.load(content)

    // When
    const actionsCard = $('[data-qa="actions-card"]').text().trim()
    const addGoalButton = $('[data-qa="add-goal-button"]').text().trim()

    // Then
    expect(actionsCard).toContain('Actions')
    expect(addGoalButton).toContain('Add a new goal')
  })

  it('should display error message if problemRetrievingData is true', () => {
    // Given
    const content = renderTemplate(0, 0, [], true)
    const $ = cheerio.load(content)

    // When
    const errorMessage = $('[data-qa="problem-retrieving-goals-message"]').text().trim()

    // Then
    expect(errorMessage).toContain('Sorry, the service is currently unavailable.')
  })
})
