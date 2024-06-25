import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import type { Action } from 'viewModels'

nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])
describe('Tests for actions card component', () => {
  describe('Core action card component', () => {
    it('Should render the action card component given actions', () => {
      const actions: Action[] = [
        { title: 'Do a thing', href: '/thing' },
        { title: 'Do another thing', href: '/another-thing' },
      ]
      const params = { actions }

      const content = nunjucks.render('test.njk', { params })

      const $ = cheerio.load(content)
      const actionCard = $('.actions-card')
      expect(actionCard.length).toEqual(1)
    })

    it('Should render the action card component given a specific ID', () => {
      const actions: Action[] = [
        { title: 'Do a thing', href: '/thing' },
        { title: 'Do another thing', href: '/another-thing' },
      ]
      const params = {
        id: 'my-actions-card',
        actions,
      }

      const content = nunjucks.render('test.njk', { params })

      const $ = cheerio.load(content)
      const actionCard = $('#my-actions-card')
      expect(actionCard.length).toEqual(1)
    })

    it('Should support setting custom attributes such as data-qa', () => {
      const actions: Action[] = [
        { title: 'Do a thing', href: '/thing' },
        { title: 'Do another thing', href: '/another-thing' },
      ]
      const params = {
        actions,
        attributes: { 'data-qa': 'my-actions-card' },
      }

      const content = nunjucks.render('test.njk', { params })

      const $ = cheerio.load(content)
      const actionCard = $('[data-qa=my-actions-card]')
      expect(actionCard.length).toEqual(1)
    })

    it.each([undefined, null, ...[]])(
      'Should not render the action card component given %s actions',
      (actions: Array<Action>) => {
        const params = { actions }

        const content = nunjucks.render('test.njk', { params })

        const $ = cheerio.load(content)
        const actionCard = $('.actions-list')
        expect(actionCard.length).toEqual(0)
      },
    )
  })

  describe('Actions within the action card component', () => {
    it('Should display a link for each action', () => {
      const actions: Action[] = [
        { title: 'Do a thing', href: '/thing' },
        { title: 'Do another thing', href: '/another-thing' },
      ]
      const params = { actions }

      const content = nunjucks.render('test.njk', { params })

      const $ = cheerio.load(content)
      const actionListItems = $('.actions-card').find('li')
      expect(actionListItems.length).toEqual(2)
      expect($(actionListItems[0]).find('a').text().trim()).toEqual('Do a thing')
      expect($(actionListItems[0]).find('a').attr('href')).toEqual('/thing')
      expect($(actionListItems[1]).find('a').text().trim()).toEqual('Do another thing')
      expect($(actionListItems[1]).find('a').attr('href')).toEqual('/another-thing')
    })

    it('Should support setting custom attributes such as data-qa on individual actions', () => {
      const actions: Action[] = [
        { title: 'Do a thing', href: '/thing', attributes: { 'data-qa': 'thing-link' } },
        { title: 'Do another thing', href: '/another-thing', attributes: { 'data-qa': 'another-thing-link' } },
      ]
      const params = { actions }

      const content = nunjucks.render('test.njk', { params })

      const $ = cheerio.load(content)
      expect($('[data-qa=thing-link]').text().trim()).toEqual('Do a thing')
      expect($('[data-qa=another-thing-link]').text().trim()).toEqual('Do another thing')
    })

    it('Should support setting an id on individual actions', () => {
      const actions: Action[] = [
        { title: 'Do a thing', href: '/thing', id: 'thing-link' },
        { title: 'Do another thing', href: '/another-thing', id: 'another-thing-link' },
      ]
      const params = { actions }

      const content = nunjucks.render('test.njk', { params })

      const $ = cheerio.load(content)
      expect($('#thing-link').text().trim()).toEqual('Do a thing')
      expect($('#another-thing-link').text().trim()).toEqual('Do another thing')
    })

    it('Should support conditionally rendering individual actions with the render-if property', () => {
      const actions: Action[] = [
        { title: 'Do a thing', href: '/thing' },
        { title: 'Do another thing', href: '/another-thing', 'render-if': false },
      ]
      const params = { actions }

      const content = nunjucks.render('test.njk', { params })

      const $ = cheerio.load(content)
      const actionListItems = $('.actions-card').find('li')
      expect(actionListItems.length).toEqual(1)
      expect($(actionListItems[0]).text().trim()).toEqual('Do a thing')
    })
  })
})
