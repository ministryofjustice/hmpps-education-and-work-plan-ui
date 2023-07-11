export default class OverviewView {
  constructor(private readonly tab: string, private readonly prisonNumber: string) {}

  get renderArgs(): {
    tab: string
    prisonNumber: string
  } {
    return {
      tab: this.tab,
      prisonNumber: this.prisonNumber,
    }
  }
}
