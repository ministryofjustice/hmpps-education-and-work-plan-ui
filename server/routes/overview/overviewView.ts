export default class OverviewView {
  constructor(private readonly tab: string) {}

  get renderArgs(): {
    tab: string
  } {
    return {
      tab: this.tab,
    }
  }
}
