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
  it('Should display a link for each action', () => {
    const actions: Action[] = [
      { title: 'Do a thing', href: '/thing' },
      { title: 'Do another thing', href: '/another-thing' },
    ]
    const content = nunjucks.render('test.njk', { actions })
    const $ = cheerio.load(content)
    const actionListItems = $('.actions-list-list').find('li')
    expect(actionListItems.length).toStrictEqual(2)
    expect($(actionListItems[0]).find('a').text()).toStrictEqual('Do a thing')
    expect($(actionListItems[0]).find('a').attr('href')).toStrictEqual('/thing')
    expect($(actionListItems[1]).find('a').text()).toStrictEqual('Do another thing')
    expect($(actionListItems[1]).find('a').attr('href')).toStrictEqual('/another-thing')
  })
  it('Support setting data-qa field', () => {
    const actions: Action[] = [
      { title: 'Do a thing', href: '/thing', dataQa: 'thing-link' },
      { title: 'Do another thing', href: '/another-thing', dataQa: 'another-thing-link' },
    ]
    const content = nunjucks.render('test.njk', { actions })
    const $ = cheerio.load(content)
    expect($('[data-qa=thing-link]').text()).toStrictEqual('Do a thing')
    expect($('[data-qa=another-thing-link]').text()).toStrictEqual('Do another thing')
  })
})
