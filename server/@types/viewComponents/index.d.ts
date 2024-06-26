/**
 * Module declaring types that are used by the nunjucks view components
 */
declare module 'viewComponents' {
  export interface ActionCardParams {
    id?: string
    attributes?: Record<string, string>
    actions: Array<Action>
  }

  export interface Action {
    title: string
    href: string
    id?: string
    attributes?: Record<string, string>
    'render-if'?: boolean
  }
}
