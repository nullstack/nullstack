import Nullstack from 'nullstack'

class DateParser extends Nullstack {

  object = null;

  prepare(context) {
    const date = new Date('1992-10-16')
    context.object = { date }
    this.object = { date }
  }

  render({ object }) {
    return (
      <div>
        <div data-ssr-instance-year={this.object.date.getYear()} />
        <div data-ssr-context-year={object.date.getYear()} />
        {this.hydrated && <div data-spa-instance-year={this.object.date.getYear()} />}
        {this.hydrated && <div data-spa-context-year={object.date.getYear()} />}
      </div>
    )
  }

}

export default DateParser
