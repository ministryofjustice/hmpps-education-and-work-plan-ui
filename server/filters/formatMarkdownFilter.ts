import { marked } from 'marked'

const renderer = {
  text(text: string): string {
    return text //
      .replace(/$/gm, '<br>') // replace every CRLF (multiline mode) with <br>
      .replace(/<br>$/, '') // replace the very last <br> at the very end of the string with nothing to prevent rendering a final line break
  },
  paragraph(text: string): string {
    return `<p class='govuk-body'>${text}</p>`
  },
  list(body: string, ordered: boolean, start: number | ''): string {
    if (ordered) {
      return `<ol class='govuk-list govuk-list--number' start='${start}'>${body}</ol>`
    }
    return `<ul class='govuk-list govuk-list--bullet'>${body}</ul>`
  },
  heading(text: string, level: number, raw: string): string {
    return `<h${level} class='govuk-heading-s'>${text}</h${level}>`
  },
}

marked.use({
  async: false,
  renderer,
})

export default function formatMarkdownFilter(value: string): string {
  return marked.parse(value) as string
}
