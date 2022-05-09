import Nullstack from 'nullstack';

class TwoWayBindings extends Nullstack {

  number = 1;
  currency = 100;
  boolean = true;
  character = 'a';
  text = 'aaaa';

  object = { count: 1 };
  array = ['a', 'b', 'c'];

  zero = 0

  parse({ event, onchange }) {
    const normalized = event.target.value.replace(',', '').padStart(3, '0');
    const whole = (parseInt(normalized.slice(0, -2)) || 0).toString();
    const decimal = normalized.slice(normalized.length - 2);
    const value = parseFloat(whole + '.' + decimal);
    const bringsHappyness = value >= 1000000;
    onchange({ value, bringsHappyness });
  }

  renderCurrencyInput({ value, name }) {
    const formatted = value.toFixed(2).replace('.', ',');
    return <input name={name} value={formatted} oninput={this.parse} />
  }

  updateCharacter({ value }) {
    this.character = this.array[value];
  }

  render({ params }) {
    return (
      <div>
        <input bind={this.zero} />
        <div data-number={this.number} />
        {!this.boolean && <div data-boolean-type={typeof (this.boolean)} />}
        {this.number > 1 && <div data-number-type={typeof (this.number)} />}
        <input bind={this.number} oninput={this.updateCharacter} />
        <textarea bind={this.text} />
        <div data-character={this.character} />
        <select bind={this.character}>
          {this.array.map((character) => <option>{character}</option>)}
        </select>
        <select bind={this.boolean} name="boolean-select">
          <option value={true}>true</option>
          <option value={false}>false</option>
        </select>
        <input bind={this.boolean} type="checkbox" />
        <input bind={this.object.count} />
        <input bind={this.undeclared} data-undeclared />
        {this.array.map((value, index) => (
          <input bind={this.array[index]} />
        ))}
        <input bind={params.page} />
        <CurrencyInput bind={this.currency} />
      </div>
    )
  }

}

export default TwoWayBindings;