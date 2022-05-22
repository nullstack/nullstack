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

  bringsHappiness = false

  parse({ event, source, name, callback }) {
    const normalized = event.target.value.replace(',', '').padStart(3, '0');
    const whole = (parseInt(normalized.slice(0, -2)) || 0).toString();
    const decimal = normalized.slice(normalized.length - 2);
    const value = parseFloat(whole + '.' + decimal);
    const bringsHappiness = value >= 1000000;
    source[name] = value
    callback({ bringsHappiness })
  }

  renderCurrencyInput({ source, name, onchange }) {
    const formatted = source[name].toFixed(2).replace('.', ',');
    return <input data-currency name={name} source={source} value={formatted} oninput={this.parse} callback={onchange} />
  }

  updateCharacter({ value }) {
    this.character = this.array[value];
  }

  setHappiness({ bringsHappiness }) {
    this.bringsHappiness = bringsHappiness
  }

  render({ params }) {
    return (
      <div data-brings-happiness={this.bringsHappiness}>
        <input bind={this.zero} />
        <div data-number={this.number} />
        {!this.boolean && <div data-boolean-type={typeof this.boolean} />}
        {this.number > 1 && <div data-number-type={typeof this.number} />}
        <input bind={this.number} oninput={this.updateCharacter} />
        <textarea bind={this.text} data-text={this.text} />
        <button onclick={{ text: 'bbbb' }} data-textarea>textarea b</button>
        <div data-character={this.character} />
        <select bind={this.character}>
          {this.array.map((character) => <option>{character}</option>)}
        </select>
        <button onclick={{ character: 'b' }} data-select>select b</button>
        <select bind={this.boolean} name="boolean-select">
          <option value={true}>true</option>
          <option value={false}>false</option>
        </select>
        <input bind={this.boolean} type="checkbox" />
        <button onclick={{ boolean: false }} data-checkbox>boolean false</button>
        <input bind={this.object.count} />
        <input bind={this.undeclared} data-undeclared />
        {this.array.map((value, index) => (
          <input bind={this.array[index]} />
        ))}
        <input bind={params.page} />
        <CurrencyInput bind={this.currency} onchange={this.setHappiness} />
      </div>
    )
  }

}

export default TwoWayBindings;