import Page, { PageElement } from '../page'

export default class InPrisonCoursesAndQualificationsPage extends Page {
  constructor() {
    super('in-prison-courses-and-qualifications')
  }

  clickCompletedCoursesTab = (): InPrisonCoursesAndQualificationsPage => {
    this.completedCoursesTab().click()
    return this
  }

  hasCompletedCourse = (expectedCourseName: string): InPrisonCoursesAndQualificationsPage => {
    this.completedCourseWithName(expectedCourseName).should('be.visible')
    return this
  }

  hasNoCompletedCourses = (): InPrisonCoursesAndQualificationsPage => {
    this.completedCoursesTable().should('not.exist')
    this.noCompletedCoursesMessage().should('be.visible')
    return this
  }

  clickInProgressCoursesTab = (): InPrisonCoursesAndQualificationsPage => {
    this.inProgressCoursesTab().click()
    return this
  }

  hasInProgressCourse = (expectedCourseName: string): InPrisonCoursesAndQualificationsPage => {
    this.completedCourseWithName(expectedCourseName).should('be.visible')
    return this
  }

  hasNoInProgressCourses = (): InPrisonCoursesAndQualificationsPage => {
    this.inProgressCoursesTable().should('not.exist')
    this.noInProgressCoursesMessage().should('be.visible')
    return this
  }

  clickWithdrawnCoursesTab = (): InPrisonCoursesAndQualificationsPage => {
    this.withdrawnCoursesTab().click()
    return this
  }

  hasWithdrawnCourse = (expectedCourseName: string): InPrisonCoursesAndQualificationsPage => {
    this.completedCourseWithName(expectedCourseName).should('be.visible')
    return this
  }

  hasNoWithdrawnCourses = (): InPrisonCoursesAndQualificationsPage => {
    this.withdrawnCoursesTable().should('not.exist')
    this.noWithdrawnCoursesMessage().should('be.visible')
    return this
  }

  hasCuriousUnavailableMessageDisplayed() {
    this.curiousUnavailableMessage().should('be.visible')
    return this
  }

  private completedCoursesTab = (): PageElement => cy.get('#tab_completed-courses')

  private completedCoursesTable = (): PageElement => cy.get('[data-qa=completed-courses-sortable-table')

  private completedCourseWithName = (expectedCourseName: string): PageElement =>
    this.completedCoursesTable().find(`[data-qa=course-name]:contains(${expectedCourseName})`)

  private noCompletedCoursesMessage = (): PageElement => cy.get('[data-qa=no-completed-courses-message')

  private inProgressCoursesTab = (): PageElement => cy.get('#tab_in-progress-courses')

  private inProgressCoursesTable = (): PageElement => cy.get('[data-qa=in-progress-courses-sortable-table')

  private inProgressCourseWithName = (expectedCourseName: string): PageElement =>
    this.inProgressCoursesTable().find(`[data-qa=course-name]:contains(${expectedCourseName})`)

  private noInProgressCoursesMessage = (): PageElement => cy.get('[data-qa=no-in-progress-courses-message')

  private withdrawnCoursesTab = (): PageElement => cy.get('#tab_withdrawn-courses')

  private withdrawnCoursesTable = (): PageElement => cy.get('[data-qa=withdrawn-courses-sortable-table')

  private withdrawnCourseWithName = (expectedCourseName: string): PageElement =>
    this.withdrawnCoursesTable().find(`[data-qa=course-name]:contains(${expectedCourseName})`)

  private noWithdrawnCoursesMessage = (): PageElement => cy.get('[data-qa=no-withdrawn-courses-message')

  private curiousUnavailableMessage = (): PageElement => cy.get('[data-qa=curious-unavailable-message]')
}
