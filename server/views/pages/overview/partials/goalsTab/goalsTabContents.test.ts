import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay, toDate } from 'date-fns'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDateFilter from '../../../../../filters/formatDateFilter'
import formatStepStatusValueFilter from '../../../../../filters/formatStepStatusValueFilter'
import formatReasonToArchiveGoalFilter from '../../../../../filters/formatReasonToArchiveGoalFilter'
import { aValidGoal } from '../../../../../testsupport/actionPlanTestDataBuilder'
import config from '../../../../../config'
import { aValidGoalResponse } from '../../../../../testsupport/actionPlanResponseTestDataBuilder'
import GoalStatusValue from '../../../../../enums/goalStatusValue'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/govuk/',
  'node_modules/govuk-frontend/govuk/components/',
  'node_modules/govuk-frontend/govuk/template/',
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

jest.mock('../../../../../config', () => ({
  featureToggles: {
    completedGoalsEnabled: true,
  },
}))

njkEnv.addGlobal('featureToggles', config.featureToggles)

njkEnv.addFilter('formatDate', formatDateFilter)
njkEnv.addFilter('formatStepStatusValue', formatStepStatusValueFilter)
njkEnv.addFilter('formatReasonToArchiveGoal', formatReasonToArchiveGoalFilter)

const prisonerSummary = aValidPrisonerSummary()

const template = 'goalsTabContents.njk'

const completedGoalWithoutNotes = {
  ...aValidGoalResponse(),
  status: GoalStatusValue.COMPLETED,
  title: 'Learn Spanish',
  notesByType: {
    GOAL_COMPLETION: [],
    GOAL_ARCHIVAL: [],
    GOAL: [],
  },
}

const completedGoalWithGoalNote = {
  ...aValidGoalResponse(),
  status: GoalStatusValue.COMPLETED,
  title: 'Learn woodwork',
  notesByType: {
    GOAL: [
      {
        reference: '8092b80e-4d60-418f-983a-da457ff8df40',
        content: 'Prisoner is not good at listening',
        type: 'GOAL',
        createdBy: 'asmith_gen',
        createdByDisplayName: 'Alex Smith',
        createdAt: new Date('2023-01-16T09:34:12.453Z'),
        createdAtPrisonName: 'Brixton (HMP)',
        updatedBy: 'asmith_gen',
        updatedByDisplayName: 'Alex Smith',
        updatedAt: new Date('2023-09-23T13:42:01.401Z'),
        updatedAtPrisonName: 'Brixton (HMP)',
      },
    ],
    GOAL_ARCHIVAL: [],
    GOAL_COMPLETION: [],
  },
}

const completedGoalWithCompletedGoalNote = {
  ...aValidGoalResponse(),
  status: GoalStatusValue.COMPLETED,
  title: 'Learn French',
  notesByType: {
    GOAL_COMPLETION: [
      {
        reference: '8092b80e-4d60-418f-983a-da457ff8df40',
        content: 'Prisoner has completed the course and passed the exam.',
        type: 'GOAL_COMPLETED',
        createdBy: 'asmith_gen',
        createdByDisplayName: 'Alex Smith',
        createdAt: new Date('2023-01-16T09:34:12.453Z'),
        createdAtPrisonName: 'Brixton (HMP)',
        updatedBy: 'asmith_gen',
        updatedByDisplayName: 'Alex Smith',
        updatedAt: new Date('2023-09-23T13:42:01.401Z'),
        updatedAtPrisonName: 'Brixton (HMP)',
      },
    ],
    GOAL_ARCHIVAL: [],
    GOAL: [],
  },
}

const completedGoalWithGoalNoteAndCompletedGoalNote = {
  ...aValidGoalResponse(),
  status: GoalStatusValue.COMPLETED,
  steps: [{ title: 'Learn pottery' }],
  notesByType: {
    GOAL_COMPLETION: [
      {
        reference: '8092b80e-4d60-418f-983a-da457ff8df40',
        content: 'Prisoner has completed the course.',
        type: 'GOAL_COMPLETED',
        createdBy: 'asmith_gen',
        createdByDisplayName: 'Alex Smith',
        createdAt: new Date('2023-01-16T09:34:12.453Z'),
        createdAtPrisonName: 'Brixton (HMP)',
        updatedBy: 'asmith_gen',
        updatedByDisplayName: 'Alex Smith',
        updatedAt: new Date('2023-09-23T13:42:01.401Z'),
        updatedAtPrisonName: 'Brixton (HMP)',
      },
    ],
    GOAL_ARCHIVAL: [],
    GOAL: [
      {
        reference: '8092b80e-4d60-418f-983a-da457ff8lg46',
        content: 'Prisoner has trouble concentrating.',
        type: 'GOAL',
        createdBy: 'asmith_gen',
        createdByDisplayName: 'Alex Smith',
        createdAt: new Date('2023-01-16T09:34:12.453Z'),
        createdAtPrisonName: 'Brixton (HMP)',
        updatedBy: 'asmith_gen',
        updatedByDisplayName: 'Alex Smith',
        updatedAt: new Date('2023-09-23T13:42:01.401Z'),
        updatedAtPrisonName: 'Brixton (HMP)',
      },
    ],
  },
}

describe('ViewGoalsController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render in-progress goals correctly, in order of target completion date, soonest first', async () => {
    // Given
    const inProgressGoal1 = aValidGoal({
      targetCompletionDate: startOfDay('2024-12-01'),
      status: 'ACTIVE',
      title: 'Learn French',
    })
    const inProgressGoal2 = aValidGoal({
      targetCompletionDate: startOfDay('2024-11-01'),
      status: 'ACTIVE',
      title: 'Learn Spanish',
    })
    const inProgressGoal3 = aValidGoal({
      targetCompletionDate: startOfDay('2025-01-01'),
      status: 'ACTIVE',
      title: 'Learn German',
    })

    const pageViewModel = {
      prisonerSummary,
      inProgressGoals: [inProgressGoal1, inProgressGoal2, inProgressGoal3],
      problemRetrievingData: false,
      tab: 'goals',
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="in-progress-goal-summary-card"] [data-qa="goal-summary-card-heading"]').length).toEqual(3)
    // Assert the goals are in the correct order, based on target completion date, soonest first
    // First rendered goal ....
    expect(
      $('[data-qa="in-progress-goal-summary-card"] [data-qa="goal-summary-card-heading"]').eq(0).text().trim(),
    ).toEqual('Achieve goal by 1 November 2024')
    expect(
      $('[data-qa="in-progress-goal-summary-card"] [data-qa="goal-summary-card-goal-title"]').eq(0).text().trim(),
    ).toEqual('Learn Spanish')
    // Second rendered goal ....
    expect(
      $('[data-qa="in-progress-goal-summary-card"] [data-qa="goal-summary-card-heading"]').eq(1).text().trim(),
    ).toEqual('Achieve goal by 1 December 2024')
    expect(
      $('[data-qa="in-progress-goal-summary-card"] [data-qa="goal-summary-card-goal-title"]').eq(1).text().trim(),
    ).toEqual('Learn French')
    // Third rendered goal ....
    expect(
      $('[data-qa="in-progress-goal-summary-card"] [data-qa="goal-summary-card-heading"]').eq(2).text().trim(),
    ).toEqual('Achieve goal by 1 January 2025')
    expect(
      $('[data-qa="in-progress-goal-summary-card"] [data-qa="goal-summary-card-goal-title"]').eq(2).text().trim(),
    ).toEqual('Learn German')
    // Assert the first goal's hint text - if this one is correctly formatted/laid out, they all will be
    const hint = $('[data-qa="in-progress-goal-summary-card"] [data-qa=goal-last-updated-hint]').first()
    expect(hint.text().trim()).toEqual('Last updated on 23 September 2023 by Alex Smith, Brixton (HMP)')
  })

  it('should render archived goals correctly, in order or archival date (updatedDate), soonest last', async () => {
    // Given
    const archivedGoal1 = aValidGoal({
      updatedAt: toDate('2024-12-01T09:12:23.123Z'),
      targetCompletionDate: startOfDay('2024-12-31'),
      status: 'ARCHIVED',
      title: 'Learn French',
    })
    const archivedGoal2 = aValidGoal({
      updatedAt: toDate('2024-12-01T08:57:18.561Z'),
      targetCompletionDate: startOfDay('2024-12-31'),
      status: 'ARCHIVED',
      title: 'Learn Spanish',
    })
    const archivedGoal3 = aValidGoal({
      updatedAt: toDate('2025-01-01T14:43:09.931Z'),
      targetCompletionDate: startOfDay('2025-06-30'),
      status: 'ARCHIVED',
      title: 'Learn German',
    })

    const pageViewModel = {
      prisonerSummary,
      archivedGoals: [archivedGoal1, archivedGoal2, archivedGoal3],
      problemRetrievingData: false,
      tab: 'goals',
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="archived-goal-summary-card"] [data-qa="goal-summary-card-heading"]').length).toEqual(3)
    // Assert the goals are in the correct order, based on updated date, soonest last
    // First rendered goal ....
    expect(
      $('[data-qa="archived-goal-summary-card"] [data-qa="goal-summary-card-heading"]').eq(0).text().trim(),
    ).toEqual('Achieve goal by 30 June 2025')
    expect(
      $('[data-qa="archived-goal-summary-card"] [data-qa="goal-summary-card-goal-title"]').eq(0).text().trim(),
    ).toEqual('Learn German')
    // Second rendered goal ....
    expect(
      $('[data-qa="archived-goal-summary-card"] [data-qa="goal-summary-card-heading"]').eq(1).text().trim(),
    ).toEqual('Achieve goal by 31 December 2024')
    expect(
      $('[data-qa="archived-goal-summary-card"] [data-qa="goal-summary-card-goal-title"]').eq(1).text().trim(),
    ).toEqual('Learn French')
    // Third rendered goal ....
    expect(
      $('[data-qa="archived-goal-summary-card"] [data-qa="goal-summary-card-heading"]').eq(2).text().trim(),
    ).toEqual('Achieve goal by 31 December 2024')
    expect(
      $('[data-qa="archived-goal-summary-card"] [data-qa="goal-summary-card-goal-title"]').eq(2).text().trim(),
    ).toEqual('Learn Spanish')
    // Assert the first goal's hint text - if this one is correctly formatted/laid out, they all will be
    const hint = $('[data-qa="archived-goal-summary-card"] [data-qa=goal-last-updated-hint]').first()
    expect(hint.text().trim()).toEqual('Archived on 1 January 2025 by Alex Smith, Brixton (HMP)')
  })

  it('should correctly render a completed goal which has a completed goal note and a goal note', async () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      completedGoals: [completedGoalWithGoalNoteAndCompletedGoalNote],
      problemRetrievingData: false,
      tab: 'goals',
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="completed-goal-summary-card"]').length).toEqual(1)
    expect($('[data-qa="goal-note"]').length).toEqual(1)
    expect($('[data-qa="goal-note"]').first().text()).toContain('Prisoner has trouble concentrating.')
    expect($('[data-qa="goal-completion-note"]').length).toEqual(1)
    expect($('[data-qa="goal-completion-note"]').first().text()).toContain('Prisoner has completed the course.')
    expect($('[data-qa="completed-goal-summary-card"]').first().text()).toContain('Learn Spanish')
    const hint = $('[data-qa=goal-last-updated-hint]').first()
    expect(hint.text().replace(/\s+/g, ' ').trim()).toContain(
      'Goal marked as complete on 23 September 2023 by Alex Smith',
    )
  })

  it('should correctly render a completed goal which has a goal note and does not have a completed goal note', async () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      completedGoals: [completedGoalWithGoalNote],
      problemRetrievingData: false,
      tab: 'goals',
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="completed-goal-summary-card"]').length).toEqual(1)
    expect($('[data-qa="goal-completion-note"]').length).toEqual(0)
    expect($('[data-qa="goal-note"]').first().text()).toContain('Prisoner is not good at listening')
    expect($('[data-qa="completed-goal-summary-card"]').first().text()).toContain('Learn woodwork')
    const hint = $('[data-qa=goal-last-updated-hint]').first()
    expect(hint.text().replace(/\s+/g, ' ').trim()).toContain(
      'Goal marked as complete on 23 September 2023 by Alex Smith',
    )
  })

  it('should correctly render a completed goal which has a completed goal note and does not have a goal note', async () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      completedGoals: [completedGoalWithCompletedGoalNote],
      problemRetrievingData: false,
      tab: 'goals',
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="completed-goal-summary-card"]').length).toEqual(1)
    expect($('[data-qa="goal-note"]').length).toEqual(0)
    expect($('[data-qa="goal-completion-note"]').first().text()).toContain(
      'Prisoner has completed the course and passed the exam.',
    )
    expect($('[data-qa="completed-goal-summary-card"]').first().text()).toContain('Learn French')
    const hint = $('[data-qa=goal-last-updated-hint]').first()
    expect(hint.text().replace(/\s+/g, ' ').trim()).toContain(
      'Goal marked as complete on 23 September 2023 by Alex Smith',
    )
  })

  it('should correctly render a completed goal which has no notes', async () => {
    // Given
    const pageViewModel = {
      prisonerSummary,
      completedGoals: [completedGoalWithoutNotes],
      problemRetrievingData: false,
      tab: 'goals',
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa="completed-goal-summary-card"]').length).toEqual(1)
    expect($('[data-qa="goal-note"]').length).toEqual(0)
    expect($('[data-qa="goal-completion-note"]').length).toEqual(0)
    expect($('[data-qa="completed-goal-summary-card"]').first().text()).toContain('Learn Spanish')
    const hint = $('[data-qa=goal-last-updated-hint]').first()
    expect(hint.text().replace(/\s+/g, ' ').trim()).toContain(
      'Goal marked as complete on 23 September 2023 by Alex Smith',
    )
  })
})
