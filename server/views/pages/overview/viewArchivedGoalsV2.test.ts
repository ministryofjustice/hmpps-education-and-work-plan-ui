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

describe('viewArchivedGoalsV2', () => {
  const renderTemplate = (
    inProgressGoalsCount: number,
    archivedGoalsCount: number,
    goals: Goal[] = [],
    problemRetrievingData = false,
  ) => {
    return nunjucks.render('pages/overview/viewArchivedGoalsV2.njk', {
      prisonerSummary,
      inProgressGoalsCount,
      archivedGoalsCount,
      goals,
      problemRetrievingData,
      activeTab: 'archived',
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

    const overviewTab = $('[data-qa=tab-overview]').text().trim()
    const goalsTab = $('[data-qa=tab-goals]').text().trim()
    const supportNeedsTab = $('[data-qa=tab-support-needs]').text().trim()
    const educationAndTrainingTab = $('[data-qa=tab-education-and-training]').text().trim()
    const workAndInterestsTab = $('[data-qa=tab-work-and-interests]').text().trim()
    const timelineTab = $('[data-qa=tab-timeline]').text().trim()
    expect(overviewTab).toContain('Overview')
    expect(goalsTab).toContain('Goals')
    expect(supportNeedsTab).toContain('Support needs')
    expect(educationAndTrainingTab).toContain('Education and training')
    expect(workAndInterestsTab).toContain('Work and interests')
    expect(timelineTab).toContain('Timeline')
  })

  it('should display the in progress and archived goal tabs with correct number of goals', () => {
    // Given
    const content = renderTemplate(2, 2)
    const $ = cheerio.load(content)

    const inProgressTabText = $('[data-qa=in-progress-tab]').text().trim()
    const archivedTabText = $('[data-qa=archived-tab]').text().trim()
    expect(inProgressTabText).toContain('In progress (2 goals)')
    expect(archivedTabText).toContain('Archived (2 goals)')
  })

  it('should correctly display "goal" when there is 1 goal', () => {
    // Given
    const content = renderTemplate(1, 1)
    const $ = cheerio.load(content)

    const inProgressTabText = $('[data-qa=in-progress-tab]').text().trim()
    const archivedTabText = $('[data-qa=archived-tab]').text().trim()
    expect(inProgressTabText).toContain('In progress (1 goal)')
    expect(archivedTabText).toContain('Archived (1 goal)')
  })

  it('should display "no archived goals" message when there are no archived goals', () => {
    // Given
    const content = renderTemplate(1, 0)
    const $ = cheerio.load(content)

    const noArchivedGoalsMessage = $('[data-qa="no-archived-goals-message"]').text().trim()
    expect(noArchivedGoalsMessage).toContain('Jimmy Lightfingers has no archived goals')
  })

  it('should render the archived goals correctly with the correct content', () => {
    // Given
    const content = renderTemplate(2, 0, [aValidGoal(), aValidGoal({ title: 'Learn Italian' })])
    const $ = cheerio.load(content)

    const goalCards = $('[data-qa="goal-summary-card"]')
    expect(goalCards.length).toEqual(2)

    const firstGoalCard = $(goalCards[0])
    expect(firstGoalCard.text()).toContain('Learn Spanish')

    const firstUnarchiveButton = firstGoalCard.find('[data-qa="goal-1-unarchive-button"]')
    expect(firstUnarchiveButton.text()).toContain('Reactivate this goal')

    const secondGoalCard = $(goalCards[1])
    expect(secondGoalCard.text()).toContain('Learn Italian')

    const secondUnarchiveButton = secondGoalCard.find('[data-qa="goal-2-unarchive-button"]')
    expect(secondUnarchiveButton.text()).toContain('Reactivate this goal')
  })

  it('should display Actions card', () => {
    // Given
    const content = renderTemplate(1, 1)
    const $ = cheerio.load(content)
    const actionsCard = $('[data-qa="actions-card"]').text().trim()
    const addGoalButton = $('[data-qa="add-goal-button"]').text().trim()
    expect(actionsCard).toContain('Actions')
    expect(addGoalButton).toContain('Add a new goal')
  })

  it('should display error message if problemRetrievingData is true', () => {
    // Given
    const content = renderTemplate(0, 0, [], true)
    const $ = cheerio.load(content)
    const errorMessage = $('[data-qa="problem-retrieving-goals-message"]').text().trim()
    expect(errorMessage).toContain('Sorry, the service is currently unavailable.')
  })
})
