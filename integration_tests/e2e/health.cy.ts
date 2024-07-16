context('Healthcheck', () => {
  context('All healthy', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubAuthPing')
      cy.task('stubManageUsersApiPing')
      cy.task('stubEducationAndWorkPlanApiPing')
      cy.task('stubPrisonerSearchApiPing')
      cy.task('stubPrisonRegisterApiPing')
      cy.task('stubTokenVerificationPing')
    })

    it('Health check page is visible and UP', () => {
      cy.request('/health').its('body.status').should('equal', 'UP')
    })

    it('Ping is visible and UP', () => {
      cy.request('/ping').its('body.status').should('equal', 'UP')
    })

    it('Info is visible', () => {
      cy.request('/info').its('body').should('exist')
    })

    it('Info contains activeAgencies array', () => {
      cy.request('/info').its('body.activeAgencies').should('be.an', 'array')
    })
  })

  context('Some unhealthy', () => {
    beforeEach(() => {
      cy.task('reset')
      cy.task('stubAuthPing')
      cy.task('stubManageUsersApiPing')
      cy.task('stubEducationAndWorkPlanApiPing')
      cy.task('stubPrisonerSearchApiPing')
      cy.task('stubPrisonRegisterApiPing', 500)
      cy.task('stubTokenVerificationPing', 500)
    })

    it('Reports correctly when token verification down', () => {
      cy.request({ url: '/health', method: 'GET', failOnStatusCode: false }).then(response => {
        expect(response.body.components.hmppsAuth.status).to.equal('UP')
        expect(response.body.components.manageUsersApi.status).to.equal('UP')
        expect(response.body.components.educationAndWorkPlan.status).to.equal('UP')
        expect(response.body.components.prisonerSearch.status).to.equal('UP')
        expect(response.body.components.prisonRegister.status).to.equal('DOWN')
        expect(response.body.components.prisonRegister.details).to.contain({ status: 500, retries: 2 })
        expect(response.body.components.tokenVerification.status).to.equal('DOWN')
        expect(response.body.components.tokenVerification.details).to.contain({ status: 500, retries: 2 })
      })
    })

    it('Health check page is visible and DOWN', () => {
      cy.request({ url: '/health', method: 'GET', failOnStatusCode: false }).its('body.status').should('equal', 'DOWN')
    })
  })
})
